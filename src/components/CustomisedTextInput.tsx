import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface CustomisedTextInputProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  valid?: boolean;
  showToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export default function CustomisedTextInput({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  valid,
  showToggle,
  showPassword,
  onTogglePassword,
}: CustomisedTextInputProps) {
  const inputType = showToggle ? (showPassword ? "text" : "password") : type;

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <TextField
        id={id}
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        fullWidth
        size="small"
        slotProps={{
          input: {
            endAdornment: showToggle ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={onTogglePassword}
                  edge="end"
                  size="small"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <VisibilityIcon fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ) : undefined,
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            fontSize: "14px",
            backgroundColor: "#fff",
            "& fieldset": {
              borderColor: valid ? "#22c55e" : "#d1d5db",
            },
            "&:hover fieldset": {
              borderColor: valid ? "#22c55e" : "#9ca3af",
            },
            "&.Mui-focused fieldset": {
              borderColor: valid ? "#22c55e" : "#3b82f6",
              borderWidth: "1px",
            },
          },
          "& .MuiInputBase-input": {
            padding: "12px 16px",
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#9ca3af",
            opacity: 1,
          },
        }}
      />
    </div>
  );
}
