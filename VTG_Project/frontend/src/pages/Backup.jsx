// import React, { useState } from "react";
// import { Shield, Trash2, X, AlertTriangle, CheckCircle } from "lucide-react";

// export default function BackupDeleteCards() {
//   const [open, setOpen] = useState(false);
//   const [action, setAction] = useState(null); // 'backup' or 'delete'

//   const handleClick = (which) => {
//     setAction(which);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setAction(null);
//   };

//   const handleConfirm = async () => {
//     if (action === "backup") {
//       try {
//         const backupId = "688740daeb9bd22371be59e4"; // Replace with dynamic ID
//         const response = await fetch(
//           http://localhost:5000/api/backup/${backupId}
//         );

//         if (!response.ok) throw new Error("Backup failed!");

//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);

//         const link = document.createElement("a");
//         link.href = url;
//         link.setAttribute("download", "backup.zip");
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//         window.URL.revokeObjectURL(url);
//       } catch (error) {
//         console.error("❌ Error downloading backup:", error);
//         alert("Backup failed. Try again.");
//       }
//     } else if (action === "delete") {
//       alert("Data deleted!"); // Replace with delete logic if needed
//     }

//     handleClose();
//   };

//   return (
//     <>
//       {/* Banner */}
//       <div className="w-full mx-auto bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6 mb-12 shadow-md text-center">
//         <h1 className="text-3xl font-bold text-blue-800 mb-2">
//           Backup & Delete Settings
//         </h1>
//         <p className="text-gray-700 max-w-xl mx-auto">
//           Manage your data backup and deletion preferences securely here.
//         </p>
//       </div>

//       {/* Cards */}
//       <div className="flex flex-col lg:flex-row gap-8 justify-center max-w-4xl mx-auto">
//         {/* Backup Card */}
//         <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 flex-1 flex flex-col items-center text-center border border-white/20 hover:scale-105 hover:bg-white/90">
//           <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//           <div className="relative z-10 mb-6 p-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
//             <Shield className="w-12 h-12 text-white" />
//           </div>
//           <div className="relative z-10">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
//               Backup Data
//             </h2>
//             <p className="mb-8 text-gray-600 leading-relaxed px-2">
//               Securely save your important data to avoid any data loss.
//             </p>
//             <button
//               onClick={() => handleClick("backup")}
//               className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 group-hover:animate-pulse"
//             >
//               <span className="relative z-10 flex items-center gap-2">
//                 <Shield className="w-5 h-5" />
//                 Backup Now
//               </span>
//               <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
//             </button>
//           </div>
//         </div>

//         {/* Delete Card */}
//         <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 flex-1 flex flex-col items-center text-center border border-white/20 hover:scale-105 hover:bg-white/90">
//           <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-orange-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//           <div className="relative z-10 mb-6 p-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
//             <Trash2 className="w-12 h-12 text-white" />
//           </div>
//           <div className="relative z-10">
//             <h2 className="text-2xl font-bold mb-4 text-red-600 group-hover:text-red-700 transition-colors duration-300">
//               Delete Data
//             </h2>
//             <p className="mb-8 text-gray-600 leading-relaxed px-2">
//               Permanently remove data that is no longer needed.
//             </p>
//             <button
//               onClick={() => handleClick("delete")}
//               className="relative overflow-hidden bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 group-hover:animate-pulse"
//             >
//               <span className="relative z-10 flex items-center gap-2">
//                 <Trash2 className="w-5 h-5" />
//                 Delete Now
//               </span>
//               <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
//             onClick={handleClose}
//           ></div>
//           <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-slide-up border border-gray-200">
//             <div
//               className={`px-6 py-4 border-b border-gray-200 ${
//                 action === "backup"
//                   ? "bg-gradient-to-r from-blue-50 to-cyan-50"
//                   : "bg-gradient-to-r from-red-50 to-orange-50"
//               } rounded-t-2xl`}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   {action === "backup" ? (
//                     <div className="p-2 bg-blue-100 rounded-lg">
//                       <CheckCircle className="w-6 h-6 text-blue-600" />
//                     </div>
//                   ) : (
//                     <div className="p-2 bg-red-100 rounded-lg">
//                       <AlertTriangle className="w-6 h-6 text-red-600" />
//                     </div>
//                   )}
//                   <h3 className="text-xl font-bold text-gray-800">
//                     {action === "backup" ? "Confirm Backup" : "Confirm Delete"}
//                   </h3>
//                 </div>
//                 <button
//                   onClick={handleClose}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//                 >
//                   <X className="w-5 h-5 text-gray-500" />
//                 </button>
//               </div>
//             </div>

//             <div className="px-6 py-6">
//               <p className="text-gray-700 leading-relaxed">
//                 Are you sure you want to{" "}
//                 {action === "backup"
//                   ? "backup your data?"
//                   : "delete the data? This action cannot be undone!"}
//               </p>
//             </div>

//             <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
//               <button
//                 onClick={handleClose}
//                 className="px-6 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirm}
//                 className={`px-6 py-2.5 font-semibold rounded-lg text-white transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${
//                   action === "backup"
//                     ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
//                     : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
//                 }`}
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Animations */}
//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }

//         @keyframes slide-up {
//           from {
//             opacity: 0;
//             transform: translateY(20px) scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }

//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }

//         .animate-slide-up {
//           animation: slide-up 0.3s ease-out;
//         }
//       `}</style>
//     </>
//   );
// }
import React, { useState } from "react";
import BackupModal from "../components/BackupModal";
import {
  Button,
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Paper,
} from "@mui/material";
import { CloudDownload, Storage, Security } from "@mui/icons-material";

const BackupDeleteCards = () => {
  const [open, setOpen] = useState(false);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        {/* Header Section */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight={700}
            // color="primary"
            color="#137570"
            gutterBottom
          >
            Data Management Center
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            maxWidth={600}
            mx="auto"
          >
            Securely backup, download, and manage your image data with our
            comprehensive management system
          </Typography>
        </Box>

        {/* Feature Cards */}
        {/* <Container maxWidth="lg">
          <Grid
            container
            spacing={4}
            maxWidth="md"
            mb={4}
            sx={{ display: "flex" }}
          >
            <Grid item xs={12} md={4}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 3 }}>
                  <CloudDownload
                    sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Smart Backup
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Download images by date range or create full system backups
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 3 }}>
                  <Storage
                    sx={{ fontSize: 48, color: "secondary.main", mb: 2 }}
                  />
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Data Control
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage storage by deleting images with flexible date
                    filtering
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 3 }}>
                  <Security
                    sx={{ fontSize: 48, color: "success.main", mb: 2 }}
                  />
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Secure Operations
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All operations include confirmation dialogs and error
                    handling
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container> */}
        {/* Main Action Card */}
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            textAlign: "center",
            maxWidth: 400,
            width: "100%",
          }}
        >
          <CloudDownload sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Ready to Manage Your Data?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Access all backup and deletion tools in one convenient interface
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => setOpen(true)}
            sx={{
              bgcolor: "white",
              // color: "primary.main",
              color: "#137570",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1.1rem",
              "&:hover": {
                bgcolor: "grey.100",
                transform: "scale(1.02)",
              },
            }}
          >
            Open Backup Manager
          </Button>
        </Paper>

        <BackupModal open={open} onClose={() => setOpen(false)} />
      </Box>
    </Container>
  );
};

export default BackupDeleteCards;