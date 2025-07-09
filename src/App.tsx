/*
 * This file is part of ivs-to-pid.
 * © 2025 Luong "final" Truong
 *
 * ivs-to-pid is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ivs-to-pid is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ivs-to-pid. If not, see <https://www.gnu.org/licenses/>.
 */

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import IvsToPidForm from "./components/IvsToPidForm";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="md">
        <IvsToPidForm />
      </Container>
    </ThemeProvider>
  );
}
