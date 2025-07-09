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

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { IvToPidState } from "../lib/ivsToPid";

interface IvsToPidOutputProps {
  states: IvToPidState[];
  tid: number;
}

export default function IvsToPidOutput({ states, tid }: IvsToPidOutputProps) {
  const resultEntries = states.map((result) => (
    <TableRow key={result.pid}>
      <TableCell>{result.seed.toString(16)}</TableCell>
      <TableCell>{result.pid.toString(16)}</TableCell>
      <TableCell>{result.method}</TableCell>
      <TableCell>
        {
          // There are eight possible SIDs for a given TID that can make
          // a Pokémon with the given PID shiny.
          // This mask will make the given be at the start of this range of
          // eight SIDs.
          (tid ^ (result.pid >>> 16) ^ (result.pid & 0xffff)) & ~7
        }
      </TableCell>
    </TableRow>
  ));
  return (
    <TableContainer component="output">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell scope="col">Seed</TableCell>
            <TableCell scope="col">PID</TableCell>
            <TableCell scope="col">Method</TableCell>
            <TableCell scope="col">SID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{resultEntries}</TableBody>
      </Table>
    </TableContainer>
  );
}
