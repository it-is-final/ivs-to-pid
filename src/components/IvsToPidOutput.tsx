import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { IvToPidState } from "../lib/ivsToPid";

interface IvsToPidOutputProps {
  results: IvToPidState[];
}

export default function IvsToPidOutput({ results }: IvsToPidOutputProps) {
  const resultEntries = results.map((result) => (
    <TableRow key={result.pid}>
      <TableCell>{result.seed.toString(16)}</TableCell>
      <TableCell>{result.pid.toString(16)}</TableCell>
      <TableCell>{result.method}</TableCell>
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
          </TableRow>
        </TableHead>
        <TableBody>{resultEntries}</TableBody>
      </Table>
    </TableContainer>
  );
}
