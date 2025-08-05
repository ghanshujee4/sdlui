import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { useNavigate, useParams } from "react-router-dom";
import {
	MDBContainer, MDBCard, MDBCardBody, MDBRow, MDBCol, MDBBtn,
	MDBInput, MDBSelect, MDBSpinner, MDBAlert,
} from "mdb-react-ui-kit";
import "../assets/plugins/animation/css/animate.min.css";
import "../assets/css/style.css";
import { motion } from "framer-motion";
import StudentStatusModal from './StudentStatusModal';

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
	useEffect(() => {
		// Simulating authentication check (e.g., from API or localStorage)
		const authStatus = localStorage.getItem("userId");
		setIsAuthenticated(!!authStatus);
	}, []);

	useEffect(() => {
		const storedUserId = localStorage.getItem("userId");
		if (!storedUserId) {
			navigate("/login");
			return;
		}

		axios.get(`${config.BASE_URL}/users/${storedUserId}`)
			.then((response) => {
				setUserData(response.data);
				setFormData(response.data);
				setLoading(false)
				setadharCard(response.data.adhar);
				console.log(userData, "User data")
			})
			.catch(() => setMessage("Error loading user data."))
			.finally(() => setLoading(false));

		axios.get(`${config.BASE_URL}/shifts`).then(res => setShifts(res.data));
		axios.get(`${config.BASE_URL}/seats`).then(res => setSeats(res.data));
		axios.get(`${config.BASE_URL}/payments/${userId}`)
			.then(paymentRes =>
				setPaymentData(paymentRes.data));
		console.log("Payment data", paymentData)
	}, [navigate]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const userId = localStorage.getItem("userId");
		axios.post(`${config.BASE_URL}/users/${userId}`, formData, {
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
		})
			.then(() => setMessage("User details updated successfully!"))
			.catch(() => setMessage("Error updating user details."));
	};

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
			const response = await axios.get(fileUrl, {
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


	return (
		<>
			<nav className="pcoded-navbar menupos-fixed menu-light brand-blue ">
				<div className="navbar-warpper">
					<div className="navbar-wrapper ">
						<div className="navbar-brand header-logo">

							<img src="../assets/images/logo.svg" alt="" className="logo images" />
							<img src="../assets/images/logo-icon.svg" alt="" className="logo-thumb images" />

							<a className="mobile-menu" id="mobile-collapse" href="#!" onClick={toggleScrollDiv}><span></span></a>
						</div>

						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
							transition={{ duration: 0.4, ease: "easeInOut" }} className="navbar-content scroll-div">
							<ul className="nav pcoded-inner-navbar">
								<li className="nav-item pcoded-menu-caption">
									<label>Navigation</label>
								</li>
								<li className="nav-item">
									<a href="#" className="nav-link"><span className="pcoded-micon"><i className="feather icon-home"></i></span><span className="pcoded-mtext">Dashboard</span></a>
								</li>

								<li className="nav-item">
									<a href="form_elements.html" className="nav-link"><span className="pcoded-micon"><i className="feather icon-file-text"></i></span><span className="pcoded-mtext">Enrolment ID </span></a>
								</li>
								<li className="nav-item">
									<a href="tbl_bootstrap.html" className="nav-link"><span className="pcoded-micon"><i className="feather icon-align-justify"></i></span><span className="pcoded-mtext">Refer and get-100 </span></a>
								</li>
								<li className="nav-item pcoded-menu-caption">
									<label>Pay Due</label>
								</li>
								<li className="nav-item">
									<a href="chart-morris.html" className="nav-link"><span className="pcoded-micon"><i className="feather icon-pie-chart"></i></span><span className="pcoded-mtext">Chart</span></a>
								</li>
								<li className="nav-item">
									<a href="map-google.html" className="nav-link"><span className="pcoded-micon"><i className="feather icon-map"></i></span><span className="pcoded-mtext">Maps</span></a>
								</li>
								<li className="nav-item pcoded-menu-caption">
									<label>Pages</label>
								</li>
								<li className="nav-item pcoded-hasmenu">
									<a href="#!" className="nav-link"><span className="pcoded-micon"><i className="feather icon-lock"></i></span><span className="pcoded-mtext">Authentication</span></a>
									<ul className="pcoded-submenu">
										<li className=""><a href="auth-signup.html" className="" target="_blank">Register</a></li>
										<li className=""><a href="auth-signin.html" className="" target="_blank">Sign in</a></li>
									</ul>
								</li>
							</ul>
							<div className="card text-center">
								<div className="card-block">
									<button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
									<i className="feather icon-sunset f-40"></i>
									<h6 className="mt-3">Shastra Digital Library</h6>
									<p>Rate and review Your SDL</p>
									<a href="https://g.co/kgs/TmnPniy" target="_blank" className="btn btn-gradient-primary btn-sm text-white m-0">Rate Us Here</a>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</nav>



			{/*[ Main Content ] start*/}
			<div className="pcoded-main-container flex">

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
															<h6 className="m-b-5 text-white">NAME</h6>
															<h3 className="m-b-0 text-white">{userData?.name}</h3>
														</div>
														<div className="col-auto">
															<i className="fas fa-money-bill-alt text-c-red f-18"></i>
														</div>
													</div>
													<p className="m-b-0 text-white"><span className="label label-danger m-r-10">+11%</span>From Previous Month</p>
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
															<i className="fas fa-database text-c-blue f-18"></i>
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
													<p className="m-b-0 text-white"><span className="label label-warning m-r-10">+52%</span>From Previous Month</p>
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
															<h5 className="text-c-black mb-0">Admission Date <span className="text-muted">{userData?.admissionDate
																? new Date(userData.admissionDate).toLocaleDateString("en-GB", {
																	day: "2-digit",
																	month: "short",
																	year: "numeric",
																})
																: "N/A"}</span></h5>
														</div>
													</div>
												</div>
												<StudentStatusModal userData={userData} />
												<div className="card-block">
													<div className="row align-items-center justify-content-center card-active">
														<div className="col-6">
															<h4 className="text-center m-b-10"><span className="text-muted m-r-5">Seat: </span>{userData?.seat}</h4>
															<div className="progress">
																<div className="progress-bar progress-c-blue" role="progressbar" style={{ width: "60%", height: "6px" }} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
															</div>
														</div>
														<div className="col-6">
															<h4 className="text-center  m-b-10"><span className="text-muted m-r-5">Shift: </span>{userData?.shift}</h4>
															<div className="progress">
																<div className="progress-bar progress-c-green" role="progressbar" style={{ width: "45%", height: "6px" }} aria-valuenow="45" aria-valuemin="0" aria-valuemax="100"></div>
															</div>
														</div>
													</div>
												</div>
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
															<h5 className="text-c-info mb-0">+6.2% <span className="text-muted">Total Likes</span></h5>
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
												<div className="card-block border-bottom">
													<div className="row align-items-center justify-content-center">

														<h2 className="col-auto">
															📅
														</h2>
														<div className="col text-right">
															<h3>Established Since</h3>
															<h5 className="text-c-info mb-0">08-August-2024 <span className="text-muted"></span></h5>
														</div>
													</div>
												</div>
												<div className="card-block">
													<div className="row align-items-center justify-content-center card-active">

														<div className="calendar-box">
															📅 <strong>{today}</strong>
														</div>

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
																			<th><span>Month Paid<a className="help" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?"><i
																				className="feather icon-help-circle f-16"></i></a></span></th>
																			<th><span>Payment status <a className="help" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?"><i
																				className="feather icon-help-circle f-16"></i></a></span></th>
																			<th><span>User Name <a className="help" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?"><i
																				className="feather icon-help-circle f-16"></i></a></span></th>
																			<th><span>Mode <a className="help" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?"><i
																				className="feather icon-help-circle f-16"></i></a></span></th>
																		</tr>
																	</thead>

																	<tbody>
																		{paymentData.map((payment, index) => (
																			<tr key={index}>

																				<td>{payment.id}</td>
																				<td>{payment.amount}</td>
																				<td>{payment.dueDate ? new Date(payment.dueDate).toLocaleDateString("en-GB") : "N/A"}</td>
																				<td>{payment.monthPaid ? new Date(payment.monthPaid).toLocaleDateString("en-GB") : "N/A"}</td>
																				<td>{payment.paid ? "Paid" : "Payment Due"}</td>
																				<td>{payment.user.name}</td>
																				<td>{payment.user.email}</td>
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
												<div className="card-header">
													<h5>Profile</h5>
												</div>
												<div className="user-image text-center">
													{userData?.adharCard ? (
														<>
															<img
																src={`${config.BASE_ENV}/${userData.adharCard}`}
																className="img-radius wid-100 m-auto"
																alt="User Aadhar"
															/>
															{/* <button
																onClick={handleDownloadAdhar}
																className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
															>
																Download Aadhar
															</button> */}
														</>
													) : (
														<p className="text-red-500">Aadhar card not available</p>
													)}

													<h6 className="f-w-600 m-t-25 m-b-10">{userData?.name}</h6>
													<p>Active | Born ---</p>
													<hr />
													<p className="m-t-15">{userData?.adhar}</p>
													<div className="bg-c-blue counter-block m-t-10 p-20">
														<div className="row">
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
														</div>
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

			<MDBContainer className="py-5" style={{ backgroundImage: "url('https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1212,h=608,fit=crop/AR0bjNz2nXTlpxBy/img20240825103416-m6LJE7rLlxsPG86a.jpg')", backgroundSize: "cover", backgroundPosition: "center", height: "100vh" }}>

			</MDBContainer>
		</>
	);
};

export default Dashboard;