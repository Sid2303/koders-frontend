import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CustomisedModalProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  dialogKey?: string;
  PaperProps?: object;
  titleSx?: object;
  contentSx?: object;
  actionsSx?: object;
  showCloseButton?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const CustomisedModal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "md",
  fullWidth = true,
  dialogKey,
  PaperProps,
  titleSx,
  contentSx,
  actionsSx,
  showCloseButton = true,
  onClick,
}: CustomisedModalProps) => {
  return (
    <Dialog
      key={dialogKey}
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={PaperProps}
      onClick={onClick}
    >
      <DialogTitle sx={{ pb: 1, ...titleSx }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1} flex={1}>
            {title}
          </Box>
          {showCloseButton && (
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3, ...contentSx }}>{children}</DialogContent>

      {actions && (
        <>
          <Divider />
          <DialogActions sx={{ px: 3, py: 2, ...actionsSx }}>
            {actions}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default CustomisedModal;
