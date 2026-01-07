import React, { useState, useEffect } from "react";
import config from "../config";
import { useNavigate, useParams } from "react-router-dom";
import {
	MDBContainer
} from "mdb-react-ui-kit";
import "../assets/plugins/animation/css/animate.min.css";
import "../assets/css/style.css";
import StudentStatusModal from './StudentStatusModal';
import SidebarNav from "../login/SidebarNav";
import PaymentQR from "./../utils/PaymentQR";
import AadhaarSection from "./AadhaarSection";
import LibraryPolicy from "../sdl/LibraryPolicy";
import ShiftSeatChangeRequestPopup from "./ShiftSeatChangeRequest";
import {fetchIdCardData, downloadIdCard } from "../utils/DownloadIdCard";
import axiosInstance from "../utils/axiosInstance";
import IdCardPreview from "../utils/IdCardPreview";
// import IdCardExact from "../utils/IdCardExact";
import html2canvas from "html2canvas";
import { useRef } from "react";
import formatDateDDMMYYYY from "../utils/formatDateDDMMYYYY";

const Dashboard = () => {
	const [userData, setUserData] = useState(null);
	const { userId } = useParams();
	const [paymentData, setPaymentData] = useState('');
	const [loading, setLoading] = useState(true);
	const [formData, setFormData] = useState({
		name: "", email: "", mobile: "", address: "", purpose: "", shift: "", seat: "", adhar: ""
	});
	const [shifts, setShifts] = useState([]);
	const [seats, setSeats] = useState([]);
	const [message, setMessage] = useState("");
	const [adharCard, setadharCard] = useState("");
	const navigate = useNavigate();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [showShiftSeatPopup, setShowShiftSeatPopup] = useState(false);
	const [idCardData, setIdCardData] = useState(null);

	useEffect(() => {
		// Simulating authentication check (e.g., from API or localStorage)
		const authStatus = localStorage.getItem("token");
		setIsAuthenticated(!!authStatus);
	}, []);

	  useEffect(() => {
    const activeUserId = userId || localStorage.getItem("userId");

    if (!activeUserId) {
      navigate("/login");
      return;
    }

    setLoading(true);

    // 🔹 User
    axiosInstance
      .get(`/users/${activeUserId}`)
      .then((res) => setUserData(res.data))
      .catch(() => setMessage("Failed to load user"))
      .finally(() => setLoading(false));

    // 🔹 Payments
    axiosInstance
      .get(`/payments/${activeUserId}`)
      .then((res) => setPaymentData(res.data))
      .catch(() => console.error("Payment load failed"));

  }, [userId, navigate]);

  // ✅ UPDATE USER
  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .post(`/users/${userId}`, userData)
      .then(() => setMessage("Updated successfully"))
      .catch(() => setMessage("Update failed"));
  };

  // ✅ DOWNLOAD ID CARD
//   const downloadIdCard = async () => {
//     try {
//       const res = await axiosInstance.get(
//         `/idcard/download`,
//         { responseType: "blob" }
//       );

//       const url = window.URL.createObjectURL(
//         new Blob([res.data], { type: "application/pdf" })
//       );

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "SDL_ID_CARD.pdf";
//       a.click();

//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       alert("Unable to download ID Card");
//     }
// }
	// const adharCard = userData.adharCard;
	const handleDownloadAdhar = async () => {
		let fileUrl = userData?.adharCard;
		if (!fileUrl) {
			alert("Aadhar card not available.");
			return;
		}

		// If the path is relative like "uploads/adharCards/..."
		if (!fileUrl.startsWith("http")) {
			fileUrl = `${config.BASE_ENV}/${fileUrl}`;
		}
		try {
			const response = await axiosInstance.get(fileUrl, {
				responseType: "blob", // Important for binary file
			});
			const contentType = response.headers["content-type"];
			const extension = contentType?.split("/")[1] || "jpg"; // fallback to jpg
			const blob = new Blob([response.data], { type: contentType });
			const downloadUrl = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = downloadUrl;
			a.download = `AadharCard.${extension}`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(downloadUrl);
		} catch (error) {
			console.error("Download failed", error);
			alert("Failed to download Aadhar card.");
		}
	};
	useEffect(() => {
		if (userData?.isRegistered == 'N') {
			const triggerBtn = document.getElementById('triggerStudentModal');
			if (triggerBtn) triggerBtn.click();
		}
	}, [userData]);

	const [isOpen, setIsOpen] = useState(false);

	const toggleScrollDiv = () => {
		setIsOpen(!isOpen);
	};
	const today = new Date().toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		weekday: "long",
	});

	// 🔹 Handle Deactivation Request
	const handleDeactivationRequest = async (e) => {
		e.preventDefault();
		// const userId = localStorage.getItem("userId");
		const activeUserId = userId || localStorage.getItem("userId");
		setLoading(true);
		if (userData?.isRegistered === "Y") {
			// 💤 Send deactivation request
			if (!window.confirm("Are you sure you want to request account deactivation?")) return;

			try {
				await axiosInstance.post(
					`/requests/${userId}?type=DEACTIVATION&details=Requesting deactivation due to personal reason`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
							"Content-Type": "application/json"
						}
					}
				);
				alert("✅ Deactivation request sent successfully! Payments will be paused once approved.");
			} catch (error) {
				console.error("Error sending request:", error);
				alert("❌ Failed to send deactivation request.");
			}
			finally {
				setLoading(false);
			}
		} else {
			// ✅ Send reactivation request
			if (!window.confirm("Do you want to request reactivation of your account?")) return;

			try {
				await axiosInstance.post(
					`/requests/${userId}?type=REACTIVATION&details=Requesting account reactivation`
				);
				alert("✅ Reactivation request sent successfully! Pay fee Rs: 50");
			} catch (error) {
				console.error("Error sending reactivation request:", error);
				alert("❌ Failed to send reactivation request.");
			}
			finally {
				setLoading(false);
			}
		}
	}
	// 🔹 Handle Shift Change Request
	const handleShiftChangeRequest = async () => {
		const userId = localStorage.getItem("userId");
		if (!userId) {
			alert("You must be logged in to send requests.");
			return;
		}

		const newShift = prompt("Enter the desired new shift (e.g., SHIFT2, SHIFT3):");
		if (!newShift) return;

		try {
			const selectedShiftNames = selectedShifts.map(s => s.name).join(",");
			const details = `Shift change request to [${selectedShiftNames}] -> seat:${selectedSeat}`;

			await axiosInstance.post(`/requests/${userId}?type=SEAT_SHIFT&details=${encodeURIComponent(details)}`);


			alert(`✅ Shift change request to ${newShift} submitted successfully!`);
		} catch (error) {
			console.error("Error sending request:", error);
			alert("❌ Failed to send shift change request.");
		}
	};
useEffect(() => {
	if(userData?.isRegistered === "Y"){
    fetchIdCardData()
      .then(setIdCardData)
  }
}, [userData]);

  const cardRef = useRef();

  const downloadSnapshot = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, {
      scale: 3,              // HIGH QUALITY
      useCORS: true,
      backgroundColor: null,
    });

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "SDL_ID_CARD.png";
    link.click();
  };


const SHIFT_TIME_MAP = {
  "1": "1st : 7:00 AM – 12:00 PM",
  "SHIFT1": "1st : 7:00 AM – 12:00 PM",

  "2": "2nd : 12:00 PM – 5:00 PM",
  "SHIFT2": "2nd : 12:00 PM – 5:00 PM",

  "3": "3rd : 5:00 PM – 10:00 PM",
  "SHIFT3": "3rd : 5:00 PM – 10:00 PM",

  "4": "4th : 8:00 AM – 2:30 PM",
  "SHIFT4": "4th : 8:00 AM – 2:30 PM",

  "5": "5th : 2:00 PM – 8:30 PM (Flexi Seats)",
  "SHIFT5": "5th : 2:00 PM – 8:30 PM (Flexi Seats)",
};

	return (
		<>
			{/* <SidebarNav />    */}
			{/* ✅ New extracted component */}
			{/*[ Main Content ] start*/}
			<div className="pcoded-main-container flex">
				{userData && (
					<ShiftSeatChangeRequestPopup
						userId={userData.id}
						show={showShiftSeatPopup}
						onClose={() => setShowShiftSeatPopup(false)}
						onSubmitted={() => {
							console.log("Shift/Seat change request submitted!");
						}}
					/>
				)}

				<div className="pcoded-wrapper">
					<div className="pcoded-content">
						<div className="pcoded-inner-content">
							<div className="main-body">
								<div className="page-wrapper">
									{/*[ breadcrumb ] start*/}
									<div className="page-header">
										<div className="page-block">
											<div className="row align-items-center">
												<div className="col-md-12">
													<div className="page-header-title">
														<h5>Home</h5>
													</div>
													<ul className="breadcrumb">
														<li className="breadcrumb-item"><a href="index.html"><i className="feather icon-home"></i></a></li>
														<li className="breadcrumb-item"><a href="#!">Analytics Dashboard</a></li>
													</ul>
												</div>
											</div>
										</div>
									</div>
									{/*[ breadcrumb ] end*/}
									{/*[ Main Content ] start*/}
									<div className="row">

										{/*product profit start*/}
										<div className="col-xl-4 col-md-6">
											<div className="card prod-p-card bg-c-red">
												<div className="card-body">
													<div className="row align-items-center m-b-25">
														<div className="col">
															<h6 className="m-b-5 text-white">Student Name</h6>
															<h3 className="m-b-0 text-white">{userData?.name}</h3>
														</div>
														<div className="col-auto">
															<i className=" fa-money-bill-alt text-c-red f-18"></i>
														</div>
													</div>
													<p className="m-b-0 text-white"><span className="label label-danger m-r-10">+11%</span>Data Provided by User</p>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-md-6">
											<div className="card prod-p-card bg-c-blue">
												<div className="card-body">
													<div className="row align-items-center m-b-25">
														<div className="col">
															<h6 className="m-b-5 text-white">Mobile Number</h6>
															<h3 className="m-b-0 text-white">{userData?.mobile}</h3>
														</div>
														<div className="col-auto">
															<i className=" fa-database text-c-blue f-18"></i>
														</div>
													</div>
													<p className="m-b-0 text-white"><span className="label label-primary m-r-10">+12%</span>From Previous Month</p>
												</div>
											</div>
										</div>
										<div className="col-xl-4 col-md-6">
											<div className="card prod-p-card bg-c-green">
												<div className="card-body">
													<div className="row align-items-center m-b-25">
														<div className="col">
															<h6 className="m-b-5 text-white">Email</h6>
															<h5 className="m-b-0 text-white">{userData?.email}</h5>
														</div>
														{/* <div className="col-auto">
													<i className="fas fa-dollar-sign text-c-green f-18"></i>
												</div> */}
													</div>
													<p className="m-b-0 text-white"><span className="label label-success m-r-10">+52%</span>From Previous Month</p>
												</div>
											</div>
										</div>
										<div className="col-xl-12 col-md-6">
											<div className="card prod-p-card bg-c-yellow">
												<div className="card-body">
													<div className="row align-items-center m-b-25">
														<div className="col">
															<h6 className="m-b-5 text-white">Address</h6>
															<h5 className="m-b-0 text-white">{userData?.address}</h5>
														</div>
														{/* <div className="col-auto">
													<i className="fas fa-tags text-c-yellow f-18"></i>
												</div> */}
													</div>
													<p className="m-b-0 text-white"><span className="label label-warning m-r-10">Muzaffarpur, Bihar	</span> Shastra Digital Library</p>
												</div>
											</div>
										</div>
										{/*product profit end*/}
										<div className="col-md-12 col-xl-4">
											<div className="card card-social">
												<div className="card-block border-bottom">
													<div className="row align-items-center justify-content-center">
														<div className="col-auto">
															<i className="fab fa-facebook-f text-primary f-36"></i>

														</div>
														<div className="col text-right">
															<h3 style={{ color: userData?.isRegistered == "Y" ? "green" : "red" }} >{userData?.isRegistered == "Y" ? "Active" : "Inactive"}</h3>
															<h5 className="text-c-black mb-0">Admission Date <span className="text-muted">{formatDateDDMMYYYY(userData?.admissionDate)}</span></h5>
														</div>
													</div>
												</div>
												<StudentStatusModal userData={userData} paymentData={paymentData} />

												<div className="card-block">
													<div className="row align-items-center justify-content-center card-active">
														<div className="col-6">
															<h4 className="text-center m-b-10"><span className="text-muted m-r-5">Seat: </span>{userData?.seat}</h4>
															<div className="progress">
																<div className="progress-bar progress-c-blue" role="progressbar" style={{ width: "60%", height: "6px" }} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
															</div>
														</div>
														
														<div className="col-6">
															<h6 className="text-center  m-b-10"><span className="text-muted m-r-5">Shift: </span>{SHIFT_TIME_MAP[userData?.shift] ?? userData?.shift}</h6>
															<div className="progress">
																<div className="progress-bar progress-c-green" role="progressbar" style={{ width: "45%", height: "6px" }} aria-valuenow="45" aria-valuemin="0" aria-valuemax="100"></div>
															</div>
														</div>
													</div>
												</div>
												<h5 className="text-center m-b-10">
													Extra Hour {userData?.extraHour && userData.extraHour.trim() !== "" ? (
														<>allowed : {userData.extraHour}</>
													) : (
														"Not Allowed"
													)}
												</h5>

											</div>
										</div>
										<div className="col-md-6 col-xl-4">
											<div className="card card-social">
												<div className="card-block border-bottom">
													<div className="row align-items-center justify-content-center">
														<div className="col-auto">
															<i className="fab fa-twitter text-c-info f-36"></i>
														</div>
														<div className="col text-right">
															<h3>{userData?.purpose}</h3>
															<h5 className="text-c-info mb-0">Next Due Date <span className="">{userData?.payment?.dueDate}</span></h5>

														</div>
													</div>
												</div>
												<div className="card-block">
													<div className="row align-items-center justify-content-center card-active">
														<div className="col-6">
															<h5 className="text-center m-b-10"><span className="text-muted m-r-5">Age :</span>{userData?.age} Years</h5>
															<div className="progress">
																<div className="progress-bar progress-c-blue" role="progressbar" style={{ width: "40%", height: "6px" }} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
															</div>
														</div>
														<div className="col-6">
															<h5 className="text-center  m-b-10"><span className="text-muted m-r-5">Enrolment ID:</span>{userData?.id}</h5>
															<div className="progress">
																<div className="progress-bar progress-c-green" role="progressbar" style={{ width: "70%", height: "6px" }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="col-md-6 col-xl-4">
											<div className="card card-social">
												
												<div className="card-block">
													<div className="row align-items-center justify-content-center card-active">

{userData?.isRegistered === "Y" && paymentData.length > 0 && (
<IdCardPreview user={idCardData} ref={cardRef} onDownload={downloadSnapshot} />
)}
													</div>
												</div>
											</div>
										</div>
										{/*sessions-section start*/}
										<div className="col-xl-8 col-md-6">
											<div className="card table-card">
												<div className="card-header">
													<h4>Payments log</h4>
												</div>
												{paymentData.length > 0 ? (

													<div className="card-body px-0 py-0">
														<div className="table-responsive">
															<div className="session-scroll" style={{ height: "478px", position: "relative" }}>
																<table className="table table-hover m-b-0">
																	<thead>
																		<tr>
																			<th><span>User ID</span></th>
																			<th><span>Amount <a className="help" data-toggle="popover" title="Popover title"><i
																				className="feather icon-help-circle f-16"></i></a></span></th>
																			<th><span>Due Date <a className="help" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?"><i
																				className="feather icon-help-circle f-16"></i></a></span></th>
																			<th><span>Date of Payment<a className="help" data-toggle="popover" title="Date of Payment" data-content="Date of Payment"><i
																				className="feather icon-help-circle f-16"></i></a></span></th>
																			<th><span>Payment status <a className="help" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?"><i
																				className="feather icon-help-circle f-16"></i></a></span></th>
																			{/* <th><span>User Name <a className="help" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?"><i
																				className="feather icon-help-circle f-16"></i></a></span></th> */}
																			<th><span>Mode <a className="help" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?"><i
																				className="feather icon-help-circle f-16"></i></a></span></th>
																		</tr>
																	</thead>

																	<tbody>
																		{paymentData.map((payment, index) => (
																			<tr key={index} style={{ backgroundColor: payment.paid ? "#d4edda" : "#f8d7da" }}>

																				<td>{payment.id}</td>
																				<td>{payment.amount}</td>
																				<td>{payment.dueDate ? new Date(payment.dueDate).toLocaleDateString("en-IN") : "N/A"}</td>
																				<td>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString("en-GB") : "N/A"}</td>
																				<td>{payment.paid ? "Paid" : "Due"}</td>
																				{/* <td>{payment.user.name}</td> */}
																				<td>
																					{payment.amount > 0 && !payment.paid ? (
																						<PaymentQR
																							userId={payment.id}
																							userName={payment.user.name}
																							amount={payment.amount}
																						/>
																					) : (
																						"--"
																					)}
																				</td>
																			</tr>
																		))}
																	</tbody>

																</table>
															</div>
														</div>
													</div>
												) : (
													<p>No payment records available.</p>
												)}

											</div>

										</div>
										{/*sessions-section end*/}
										<div className="col-md-6 col-xl-4">
											<div className="card user-card">
												{/* <div className="card-header">
													<h5>Profile</h5>
												</div> */}
												<div className="user-image text-center">

													<p className="m-t-15">{userData?.adhar}</p>
													<div className="bg-c-blue counter-block m-t-10 p-20">

														<AadhaarSection user={userData} />
														{/* <div className="row">
															<div className="col-4">
																<i className="fas fa-calendar-check text-white f-20"></i>
																<h6 style={{ cursor: "pointer" }} className="text-white mt-2 mb-0" onClick={handleDownloadAdhar}>Adhar Card</h6>
															</div>
															<div className="col-4">
																<i className="fas fa-user text-white f-20"></i>
																<h6 className="text-white mt-2 mb-0">Pan Card</h6>
															</div>
															<div className="col-4">
																<i className="fas fa-folder-open text-white f-20"></i>
																<h6 className="text-white mt-2 mb-0">189</h6>
															</div>
														</div> */}
													</div>
													<p className="m-t-15">All Student need to adhere to the policies of library.</p>
													<hr />
													<div className="row justify-content-center user-social-link">
														<div className="col-auto"><a href="#!"><i className="fab fa-facebook-f text-primary f-22"></i></a></div>
														<div className="col-auto"><a href="#!"><i className="fab fa-twitter text-c-info f-22"></i></a></div>
														<div className="col-auto"><a href="#!"><i className="fab fa-dribbble text-c-red f-22"></i></a></div>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/*[ Main Content ] end*/}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/*[ Main Content ] end*/}

			<MDBContainer className="py-2" style={{ backgroundImage: "url('https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1212,h=608,fit=crop/AR0bjNz2nXTlpxBy/img20240825103416-m6LJE7rLlxsPG86a.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
				{/* User Request Section */}
				<div className="col-md-12 mt-4">
					<div className="card">
						<div className="card-header bg-primary text-white">
							<h3>User Requests</h3>
						</div>
						<div className="card-body">
							<p className="mb-3">Submit a request for seat/shift change or temporary deactivation of your account.</p>
							<div className="d-flex flex-wrap gap-3">
								<button
									className={`btn ${userData?.isRegistered === "Y"
										? "btn-warning glow-on-hover bg-warning cursor"
										: "btn-success glow-on-hover bg-sucess cursor"
										}`}
									onClick={handleDeactivationRequest}
									disabled={loading}
								>
									{/* {loading ? "Submitting..." : ""}
									{userData?.isRegistered === "Y"
										? "💤 Request Deactivation"
										: "✅ Request Reactivation"} */}
									{loading
										? "Submitting..."
										: userData?.requestStatus === "PENDING"
											? "⏳ Request Pending"
											: userData?.isRegistered === "Y"
												? "💤 Request Deactivation"
												: "✅ Request Reactivation"}
								</button>
								{/* Shift/Seat Change Request Button */}
								<button
									className="btn btn-info glow-on-hover bg-sucess"
									onClick={() => setShowShiftSeatPopup(true)}
								>
									🔄 Request Shift/Seat Change
								</button>
								{/* <div className="mt-3"> */}
								<button
									className="btn btn-outline-secondary glow-on-hover cursor"
									onClick={() => navigate(`/my-requests/${userId}`)}
								>
									📋 View My Requests
								</button>
								{/* </div> */}

							</div>
						</div>
					</div>
					<div className="text-muted">
						<LibraryPolicy />
					</div>
				</div>
			</MDBContainer>
		</>
	);
};
export default Dashboard;