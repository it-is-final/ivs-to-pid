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

import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {
  type Nature,
  type Gender,
  type GenderRatio,
  type Stat,
  natures,
  genders,
  type IvToPidState,
  recoverPokemonOriginSeedsFromIvs,
  ivToPidResultFilter,
} from "../lib/ivsToPid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import IvsToPidOutput from "./IvsToPidOutput";

interface InputData {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  nature: Nature | "";
  gender: Gender;
  genderRatio: GenderRatio;
  ability: 0 | 1 | "";
  tid: number;
}

function handleIvChange(
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  stat: Stat,
  inputData: InputData,
  setInputData: React.Dispatch<React.SetStateAction<InputData>>,
) {
  if (/[^0-9]/.test(event.target.value)) {
    event.preventDefault();
    return;
  }
  const statInput = Number(event.target.value);
  const newInputData = { ...inputData };
  if (statInput >= 0 && statInput <= 31) {
    newInputData[stat] = statInput;
  } else if (statInput > 31) {
    newInputData[stat] = 31;
  } else {
    newInputData[stat] = 0;
  }
  setInputData(newInputData);
}

export default function IvsToPidForm() {
  const [inputData, setInputData] = React.useState<InputData>({
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
    nature: "",
    gender: "Gender unknown",
    genderRatio: "U",
    ability: "",
    tid: 0,
  });
  const [results, setResults] = React.useState<IvToPidState[]>([]);
  const natureOptions = natures.map((nature) => (
    <MenuItem key={nature} value={nature}>
      {nature}
    </MenuItem>
  ));

  const genderLabels = {
    "Gender unknown": "Gender unknown",
    "Male": "♂",
    "Female": "♀",
  };
  const genderOptions = genders.map((gender) => (
    <MenuItem key={gender} value={gender}>
      {genderLabels[gender]}
    </MenuItem>
  ));
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const results = recoverPokemonOriginSeedsFromIvs(
      inputData.hp,
      inputData.attack,
      inputData.defense,
      inputData.specialAttack,
      inputData.specialDefense,
      inputData.speed,
    ).filter((result) =>
      ivToPidResultFilter(
        inputData.nature !== "" ? inputData.nature : null,
        inputData.gender,
        inputData.genderRatio,
        inputData.ability !== "" ? inputData.ability : null,
        result,
      ),
    );
    setResults(results);
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ marginBlock: "2em" }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <TextField
            fullWidth
            label="HP"
            value={inputData.hp}
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
              },
            }}
            onChange={(event) =>
              handleIvChange(event, "hp", inputData, setInputData)
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <TextField
            fullWidth
            label="Attack"
            value={inputData.attack}
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
              },
            }}
            onChange={(event) =>
              handleIvChange(event, "attack", inputData, setInputData)
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <TextField
            fullWidth
            label="Defense"
            value={inputData.defense}
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
              },
            }}
            onChange={(event) =>
              handleIvChange(event, "defense", inputData, setInputData)
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <TextField
            fullWidth
            label="Sp.Attack"
            value={inputData.specialAttack}
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
              },
            }}
            onChange={(event) =>
              handleIvChange(event, "specialAttack", inputData, setInputData)
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <TextField
            fullWidth
            label="Sp.Defense"
            value={inputData.specialDefense}
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
              },
            }}
            onChange={(event) =>
              handleIvChange(event, "specialDefense", inputData, setInputData)
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <TextField
            fullWidth
            label="Speed"
            value={inputData.speed}
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
              },
            }}
            onChange={(event) =>
              handleIvChange(event, "speed", inputData, setInputData)
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="nature-select-label">Nature</InputLabel>
            <Select
              labelId="nature-select-label"
              id="nature-select"
              value={inputData.nature}
              label="Nature"
              onChange={(event) => {
                const newInputData = { ...inputData };
                newInputData.nature = event.target.value;
                setInputData(newInputData);
              }}
            >
              <MenuItem value="">–</MenuItem>
              {natureOptions}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="ability-select-label">Ability</InputLabel>
            <Select
              labelId="ability-select-label"
              id="ability-select"
              value={inputData.ability}
              label="Ability"
              onChange={(event) => {
                const newInputData = { ...inputData };
                newInputData.ability = event.target.value;
                setInputData(newInputData);
              }}
            >
              <MenuItem value={""}>–</MenuItem>
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="gender-select-label">Gender</InputLabel>
            <Select
              labelId="gender-select-label"
              id="gender-select"
              value={inputData.gender}
              label="Gender"
              onChange={(event) => {
                const newInputData = { ...inputData };
                const newGender = event.target.value;
                newInputData.gender = newGender;
                if (newGender === "Gender unknown") {
                  newInputData.genderRatio = "U";
                }
                if (newGender === "Male") {
                  newInputData.genderRatio = "M";
                }
                if (newGender === "Female") {
                  newInputData.genderRatio = "F";
                }
                setInputData(newInputData);
              }}
            >
              {genderOptions}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="gender-ratio-select-label">Gender ratio</InputLabel>
            <Select
              labelId="gender-ratio-select-label"
              id="gender-ratio-select"
              value={inputData.genderRatio}
              label="Gender ratio"
              onChange={(event) => {
                const newInputData = { ...inputData };
                newInputData.genderRatio = event.target.value;
                setInputData(newInputData);
              }}
              disabled={inputData.gender === "Gender unknown"}
            >
              <MenuItem
                value={"U"}
                disabled={inputData.gender !== "Gender unknown"}
              >
                {"Gender unknown"}
              </MenuItem>
              <MenuItem value={"M"} disabled={inputData.gender !== "Male"}>
                {"100% ♂"}
              </MenuItem>
              <MenuItem
                value={"7M-1F"}
                disabled={inputData.gender === "Gender unknown"}
              >
                {"87.5% ♂, 12.5% ♀"}
              </MenuItem>
              <MenuItem
                value={"3M-1F"}
                disabled={inputData.gender === "Gender unknown"}
              >
                {"75% ♂, 25% ♀"}
              </MenuItem>
              <MenuItem
                value={"1M-1F"}
                disabled={inputData.gender === "Gender unknown"}
              >
                {"50% ♂, 50% ♀"}
              </MenuItem>
              <MenuItem
                value={"1M-3F"}
                disabled={inputData.gender === "Gender unknown"}
              >
                {"25% ♂, 75% ♀"}
              </MenuItem>
              <MenuItem value={"F"} disabled={inputData.gender !== "Female"}>
                {"100% ♀"}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <TextField
            fullWidth
            label="TID"
            value={inputData.tid}
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
              },
            }}
            onChange={(event) => {
              if (/[^0-9]/.test(event.target.value)) {
                event.preventDefault();
                return;
              }
              const tidInput = Number(event.target.value) | 0;
              const newInputData = { ...inputData };
              if (tidInput >= (0 | 0) && tidInput <= (65535 | 0)) {
                newInputData.tid = tidInput;
              } else if (tidInput > (65535 | 0)) {
                newInputData.tid = 65535 | 0;
              } else {
                newInputData.tid = 0 | 0;
              }
              setInputData(newInputData);
            }}
          />
        </Grid>
        <Grid size={12}>
          <Button fullWidth type="submit" variant="contained">
            Find
          </Button>
        </Grid>
        <IvsToPidOutput results={results} tid={inputData.tid} />
      </Grid>
    </Box>
  );
}
