import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  isOverdue?: boolean;
}

export default function StatCard({
  icon,
  value,
  label,
  isOverdue = false,
}: StatCardProps) {
  return (
    <Card
      sx={{
        transition: "all 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
        backgroundColor: isOverdue ? "#fef2f2" : "white",
        border: isOverdue ? "1px solid #fee2e2" : "1px solid #e5e7eb",
      }}
    >
      <CardContent>
        <Box sx={{ fontSize: "32px", mb: 1.5 }}>{icon}</Box>
        <Typography
          variant="h3"
          component="div"
          sx={{ fontWeight: 700, color: "#111827", mb: 1 }}
        >
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500 }}>
          {label}
          {isOverdue && (
            <Box
              component="span"
              sx={{
                ml: 1,
                fontSize: "12px",
                color: "#991b1b",
              }}
            >
              🔴 Critical
            </Box>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
}
