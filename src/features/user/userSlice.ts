import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { getAddress, type Position } from "@/services/apiGeocoding";

type CurrentPosition = {
  coords: Position;
};

function getPosition(): Promise<CurrentPosition> {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export const fetchAddress = createAsyncThunk(
  "user/fetchAddress",
  async function (_, { rejectWithValue }) {
    // 1) We get the user's geolocation position
    let positionObj: CurrentPosition;
    try {
      positionObj = await getPosition();
    } catch (err) {
      const geoErr = err as GeolocationPositionError;
      let message: string;
      switch (geoErr.code) {
        case GeolocationPositionError.PERMISSION_DENIED:
          message = "Please enable location access";
          break;
        case GeolocationPositionError.TIMEOUT:
          message = "Location request timed out";
          break;
        default:
          message = "Failed to get your location";
      }
      return rejectWithValue(message);
    }

    const position: Position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2) Then we use a reverse geocoding API to get a description of the user's address
    const addressObj = await getAddress(position);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // 3) Then we return an object with the data that we are interested in
    return { position, address };
  },
);

type UserState = {
  username: string;
  status: "idle" | "loading" | "error";
  position: Position | null;
  address: string;
  error: string;
};

const initialState: UserState = {
  username: "",
  status: "idle",
  position: null,
  address: "",
  error: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateName(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = "idle";
        state.error = "";
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.status = "error";
        state.error =
          (action.payload as string) ??
          "There was a problem getting your address. Make sure to fill this field!";
      }),
});

export const { updateName } = userSlice.actions;

export const getUsername = (state: RootState): string => state.user.username;

export default userSlice.reducer;
