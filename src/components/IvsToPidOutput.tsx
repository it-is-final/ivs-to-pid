import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { IvToPidState } from "../lib/ivsToPid";

interface IvsToPidOutputProps {
  results: IvToPidState[];
  tid: number;
}

export default function IvsToPidOutput({ results, tid }: IvsToPidOutputProps) {
  const resultEntries = results.map((result) => (
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
