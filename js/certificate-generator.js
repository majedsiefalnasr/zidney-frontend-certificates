/** @format */
// Multi language content
const MLC = {
	EN: {
		title: "Certificate of Completion",
		congratulations: "Congratulations",
		completed: "Course completed on",
		certificateID: "Certificate Id",
	},
	AR: {
		title: "شهادة اتمام",
		congratulations: "تهانينا",
		completed: "اكتملت الدورة بتاريخ",
		certificateID: "رقم تعريف الوثيقة",
	},
};
// Helper for language content
var MLC_Title = MLC.EN.title,
	MLC_Congratulations = MLC.EN.congratulations,
	MLC_Completed = MLC.EN.completed,
	MLC_CertificateID = MLC.EN.certificateID;

// Generate certificate
function generateCertification(config, data) {
	// Handling configuration
	// Fill language content
	if (config.language == "ar") {
		MLC_Title = MLC.AR.title;
		MLC_Congratulations = MLC.AR.congratulations;
		MLC_Completed = MLC.AR.completed;
		MLC_CertificateID = MLC.AR.certificateID;
	}

	// Has badge
	// No badge in template id 1
	// if (config.template.theme != "1")
	// 	if (!config.template.badge_image)
	// 		config.template.badge_image = "./img/" + config.type + "/badge.png";

	// Has side image
	// Only on template ids 1 and 3
	// if (config.template.theme == "1" || config.template.theme == "3")
	// 	if (!config.template.side_image)
	// 		config.template.side_image =
	// 			"./img/" +
	// 			config.type +
	// 			"/template-" +
	// 			config.template.theme +
	// 			"-" +
	// 			config.template.orientation +
	// 			".png";

	// Certification main container
	const certificate_container = document.getElementById("certificate");

	// Set language
	certificate_container.setAttribute("data-language", "temp-" + config.template.theme);

	// Set direction
	certificate_container.setAttribute("data-direction", config.direction);

	// Set template style
	certificate_container.setAttribute("data-style", "temp-" + config.template.theme);

	// Set view orientation
	certificate_container.setAttribute("data-orientation", config.template.orientation);

	// Has style color
	if (!config.template.color)
		if (config.template.theme == "1" || config.template.theme == "2")
			// Clear template color incase of template ids 1 and 2
			config.template.color = "";
		else config.template.color = "#e9e9e9"; // Default template color
	// Set computed color
	certificate_container.style.setProperty("--theme-color", getColorCode(config.template.color));

	// Has background
	// Only on template id 4
	if (config.template.theme == "4") {
		// Clear style color
		certificate_container.style.setProperty("--theme-color", "");

		// Default background
		if (!config.template.background)
			if (config.template.orientation == "h") config.template.background = "./img/bg-h.png";
			else config.template.background = "./img/bg-v.png";

		// Set background
		certificate_container.style.backgroundImage = "url(" + config.template.background + ")";
		certificate_container.style.backgroundSize = "cover";
		certificate_container.style.setProperty("--theme-content-color", "transparent");
	}

	// Generate certificate template id 1
	if (config.template.theme == "1") certificateTemp_1(certificate_container, config, data);

	// Generate certificate template id 2
	if (config.template.theme == "2") certificateTemp_2(certificate_container, config, data);

	// Generate certificate template id 3
	if (config.template.theme == "3") certificateTemp_3(certificate_container, config, data);

	// Generate certificate template id 4
	if (config.template.theme == "4") certificateTemp_4(certificate_container, config, data);
}

// Render to Canvas
function renderToCanvas(certificateDiv, canvasOutput) {
	// Capture the HTML content as a canvas
	html2canvas(certificateDiv, { scale: 2 }).then((canvas) => {
		// Set the output canvas size to match the captured canvas
		canvasOutput.width = canvas.width;
		canvasOutput.height = canvas.height;
		const ctx = canvasOutput.getContext("2d");

		// Draw captured canvas onto the output canvas
		ctx.drawImage(canvas, 0, 0);

		console.log("Rendered HTML content to canvas.");
	});

	// Hide certificate Div
	// certificateDiv.style.display = "none";
}

//Download PDF
function saveAsPDF(fileName = "certificate") {
	const { jsPDF } = window.jspdf;

	const canvasOutput = document.getElementById("canvasOutput");

	// Set orientation
	let orientation = "landscape";
	if (canvasOutput.width > canvasOutput.height) orientation = "landscape";
	else if (canvasOutput.width < canvasOutput.height) orientation = "portrait";
	else orientation = "square";

	const pdf = new jsPDF({
		orientation: orientation, // Set orientation to landscape or portrait
		unit: "pt", // Use points to match canvas size in pixels
		format: "letter", // Use US letter paper size
	});

	// Define padding for the PDF page (e.g., 20 points)
	const padding = 0;

	// Get the dimensions of the PDF page in points
	const pageWidth = pdf.internal.pageSize.getWidth() - 2 * padding;
	const pageHeight = pdf.internal.pageSize.getHeight() - 4 * padding;

	// Calculate scaling factor to cover the PDF page within padded area without changing aspect ratio
	const imgWidth = canvasOutput.width;
	const imgHeight = canvasOutput.height;
	const scaleFactor = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

	// Calculate the scaled dimensions with padding
	const scaledWidth = imgWidth * scaleFactor;
	const scaledHeight = imgHeight * scaleFactor;

	// Center the image on the PDF page within padding
	const xOffset = (pageWidth - scaledWidth) / 2 + padding;
	const yOffset = (pageHeight - scaledHeight) / 2 + padding;

	// Convert canvas to image and add to PDF
	pdf.addImage(
		canvasOutput.toDataURL("image/png"),
		"PNG",
		xOffset,
		yOffset,
		scaledWidth,
		scaledHeight
	);
	pdf.save("" + fileName + ".pdf");

	console.log("Canvas saved as PDF with padding.");
}

// HEX color checker
function getColorCode(color) {
	// Default color if input is invalid
	const defaultColor = "";

	// Regular expression to validate hex color code
	const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

	// Check if the input is a valid hex code
	if (hexRegex.test(color)) return color;

	// Create a temporary element to check if it's a valid color name
	const tempElement = document.createElement("div");
	tempElement.style.color = color;

	// Check if the browser interprets it as a valid color
	if (tempElement.style.color) {
		// Get the computed color, convert to hex, and return
		document.body.appendChild(tempElement); // Append temporarily to get the computed color
		const computedColor = window.getComputedStyle(tempElement).color;
		document.body.removeChild(tempElement); // Clean up

		// Convert computed RGB color to hex
		const rgbToHex = (rgb) => {
			const rgbValues = rgb.match(/\d+/g);
			return (
				"#" +
				rgbValues
					.map((val) => {
						const hex = parseInt(val).toString(16);
						return hex.length === 1 ? "0" + hex : hex;
					})
					.join("")
			);
		};

		return rgbToHex(computedColor);
	}

	// Return default color if neither a hex code nor a valid color name
	return defaultColor;
}

// Certificate template 1
function certificateTemp_1(container, config, data) {
	console.log(config.template.side_image);

	// Set content
	container.innerHTML = `
        <div class="outer">
		    <div class="light-br">
		    	<div class="dark-br">
		    		<div class="main-content">
		    			<div class="left-side">
		    				<img src="${config.template.side_image}" alt="" />
		    			</div>
		    			<div class="right-content">
		    				<div class="logo">
		    					<img id="logo" src="${config.brand.logo}" alt="" />
		    				</div>
		    				<div class="congrats">
		    					<h2>${MLC_Title}</h2>
		    					<h3>${MLC_Congratulations}, ${data.certificate.name}</h3>
		    				</div>
		    				<div class="course-name">
		    					<h1>${data.course.name}</h1>
		    					<div class="completion">
		    						${MLC_Completed} ${data.course.date} -
		    						<span>${data.course.duration}</span>
		    					</div>
		    				</div>
		    				<div class="para">
		    					${data.course.description}
		    				</div>
		    				<div class="authority">
		    					<div>
		    						<img id="sign" src="${data.authority.sign_image}" alt="${data.authority.name}" />
		    						<h3>${data.authority.name}</h3>
		    					</div>
		    				</div>
		    				<div class="certificate-id">${MLC_CertificateID} ${data.certificate.id}</div>
		    			</div>
		    		</div>
		    	</div>
		    </div>
		</div>`;

	const certificateDiv = container;
	const canvasOutput = document.getElementById("canvasOutput");

	renderToCanvas(certificateDiv, canvasOutput);
}

// Certificate template 2
function certificateTemp_2(container, config, data) {
	// Set content
	container.innerHTML = `
        <div class="outer">
		    <div class="light-br">
		    	<div class="dark-br">
		    		<div class="main-content">
		    			<div class="content">
		    				<div class="logo">
		    					<img id="logo" src="${config.brand.logo}" alt="" />
		    				</div>
		    				<div class="congrats">
		    					<h2>${MLC_Title}</h2>
		    					<h3>${MLC_Congratulations}, ${data.certificate.name}</h3>
		    				</div>
		    				<div class="course-name">
		    					<h1>${data.course.name}</h1>
		    					<div class="completion">
		    						${MLC_Completed} ${data.course.date} -
		    						<span>${data.course.duration}</span>
		    					</div>
		    				</div>
		    				<div class="para">
		    					${data.course.description}
		    				</div>
		    				<div class="authority">
		    					<div>
		    						<img id="sign" src="${data.authority.sign_image}" alt="" />
		    						<h3>${data.authority.name}</h3>
		    					</div>
		    				</div>
		    				<div class="certificate-id">${MLC_CertificateID} ${data.certificate.id}</div>
								<img class="badge" src="${config.template.badge_image}" alt="" />
		    			</div>
		    		</div>
		    	</div>
		    </div>
		</div>`;

	const certificateDiv = container;
	const canvasOutput = document.getElementById("canvasOutput");

	renderToCanvas(certificateDiv, canvasOutput);
}

// Certificate template 3
function certificateTemp_3(container, config, data) {
	// Set content
	container.innerHTML = `
    <div class="outer">
			<div class="main-content">
				<div class="left-side">
					<img src="${config.template.side_image}" alt="" />
				</div>
				<div class="right-content">
					<div class="logo">
						<img id="logo" src="${config.brand.logo}" alt="" />
					</div>
					<div class="congrats">
						<h2>${MLC_Title}</h2>
						<h3>${MLC_Congratulations}, ${data.certificate.name}</h3>
					</div>
					<div class="course-name">
						<h1>${data.course.name}</h1>
						<div class="completion">
							${MLC_Completed} ${data.course.date} -
							<span>${data.course.duration}</span>
						</div>
					</div>
					<div class="para">
						${data.course.description}
					</div>
					<div class="authority">
						<div>
							<img id="sign" src="${data.authority.sign_image}" alt="" />
							<h3>${data.authority.name}</h3>
						</div>
					</div>
					<div class="certificate-id">${MLC_CertificateID} ${data.certificate.id}</div>
					<img class="badge" src="${config.template.badge_image}" alt="" />
				</div>
			</div>
		</div>`;

	const certificateDiv = container;
	const canvasOutput = document.getElementById("canvasOutput");

	renderToCanvas(certificateDiv, canvasOutput);
}

// Certificate template 4
function certificateTemp_4(container, config, data) {
	// Set content
	container.innerHTML = `
    <div class="outer">
		  <div class="main-content">
		  	<div class="content">
		  		<div class="logo">
		  			<img id="logo" src="${config.brand.logo}" alt="" />
		  		</div>
		  		<div class="congrats">
		  			<h2>${MLC_Title}</h2>
		  			<h3>${MLC_Congratulations}, ${data.certificate.name}</h3>
		  		</div>
		  		<div class="course-name">
		  			<h1>${data.course.name}</h1>
		  			<div class="completion">
		  				${MLC_Completed} ${data.course.date} -
		  				<span>${data.course.duration}</span>
		  			</div>
		  		</div>
		  		<div class="para">
		  			${data.course.description}
		  		</div>
		  		<div class="authority">
		  			<div>
		  				<img id="sign" src="${data.authority.sign_image}" alt="" />
		  				<h3>${data.authority.name}</h3>
		  			</div>
		  		</div>
		  		<div class="certificate-id">${MLC_CertificateID} ${data.certificate.id}</div>
					<img class="badge" src="${config.template.badge_image}" alt="" />
		  	</div>
		  </div>
		</div>`;

	const certificateDiv = container;
	const canvasOutput = document.getElementById("canvasOutput");

	renderToCanvas(certificateDiv, canvasOutput);
}
