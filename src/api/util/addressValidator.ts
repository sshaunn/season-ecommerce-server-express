export const validateNewvalues = (newValues: any) => {
  for (const key of Object.keys(newValues)) {
    // validate if keys are valid
    if (!["state", "suburb", "postcode", "address", "region"].includes(key)) {
      return false;
    }
    if (key === "postcode") {
      // validate if postcode is a valid string of 4 digits
      if (!newValues.postcode.match("^[0-9]{4}$")) return false;
    }
    if (key === "state" && newValues[key] !== "VIC") {
      return false;
    }
  }
  return true;
};
