import { IArtifact } from "../types/artifact";

const getUpperCaseChars = (content: string): string => {
  return [...content].filter((char) => char.toUpperCase() === char).join("");
};

export const artifactID = (artifact: IArtifact): string => {
  // Abbreviate the artifact set name (i.e. TenacityOfTheMillelith -> TOTM)
  const setNameAbbr = getUpperCaseChars(artifact.setKey);
  // Generate an ID for artifact substats
  const substatId = artifact.substats
    .map((sub) => `${getUpperCaseChars(sub.key)}${sub.value}`)
    .join("");
  // Combine everything to return a mostly-unique artifact ID
  return `${setNameAbbr}${artifact.rarity}${artifact.level}${getUpperCaseChars(
    artifact.mainStatKey
  )}${substatId}`;
};
