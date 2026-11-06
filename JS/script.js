
/* ==================================================
   MOBILE MENU
================================================== */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const loginButton = document.querySelector(".login-btn");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("active");

        if (loginButton) {
            loginButton.classList.toggle("active");
        }
    });
}


/* ==================================================
   LOGIN SYSTEM
================================================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const emailElement = document.getElementById("email");
        const passwordElement = document.getElementById("password");

        const selectedLoginType = document.querySelector(
            'input[name="loginType"]:checked'
        );

        if (!emailElement || !passwordElement) {
            alert("Login fields not found.");
            return;
        }

        if (!selectedLoginType) {
            alert("Please select login type.");
            return;
        }

        const userId = emailElement.value.trim().toLowerCase();
        const password = passwordElement.value;
        const loginType = selectedLoginType.value;

        if (loginType === "it") {
            if (
                (userId === "mohit" && password === "1234") ||
                (userId === "kaleem" && password === "1234")
            ) {
                window.location.href = "it-dashboard.html";
            } else {
                alert("Invalid IT Team login details.");
            }
        } else if (loginType === "employee") {
            if (userId !== "" && password !== "") {
                window.location.href = "employee-dashboard.html";
            } else {
                alert("Please enter your login details.");
            }
        }
    });
}


/* ==================================================
   REQUEST FORM: SHOW / HIDE FIELDS
================================================== */

const requestCategory = document.getElementById("requestCategory");
const softwareGroup = document.getElementById("softwareGroup");
const assetGroup = document.getElementById("assetGroup");

if (requestCategory) {
    requestCategory.addEventListener("change", function () {
        if (softwareGroup) {
            softwareGroup.style.display =
                this.value === "Software" ? "block" : "none";
        }

        if (assetGroup) {
            assetGroup.style.display =
                this.value === "Asset" ? "block" : "none";
        }
    });
}


/* ==================================================
   REQUEST FORM SUBMISSION
================================================== */

const requestForm = document.getElementById("requestForm");

if (requestForm) {
    requestForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const employeeName = document.getElementById("employeeName");
        const employeeId = document.getElementById("employeeId");
        const category = document.getElementById("requestCategory");
        const software = document.getElementById("softwareName");
        const asset = document.getElementById("assetName");
        const priority = document.getElementById("priority");
        const subject = document.getElementById("requestSubject");
        const description = document.getElementById("requestDescription");

        if (
            !employeeName ||
            !employeeId ||
            !category ||
            !priority ||
            !subject ||
            !description
        ) {
            alert("Request form fields are missing.");
            return;
        }

        let requests = [];

        try {
            const savedRequests = localStorage.getItem("itRequests");
            requests = savedRequests ? JSON.parse(savedRequests) : [];

            if (!Array.isArray(requests)) {
                requests = [];
            }
        } catch (error) {
            alert("Could not read saved requests. Please check browser storage.");
            console.error("Request storage error:", error);
            return;
        }

        const newRequest = {
            id: "IT-" + Date.now(),
            employeeName: employeeName.value.trim(),
            employeeId: employeeId.value.trim(),
            category: category.value,
            software: software ? software.value : "",
            asset: asset ? asset.value : "",
            priority: priority.value,
            subject: subject.value.trim(),
            description: description.value.trim(),
            status: "New",
            assignedTo: "",
            createdAt: new Date().toLocaleString()
        };

        try {
            requests.push(newRequest);

            localStorage.setItem(
                "itRequests",
                JSON.stringify(requests)
            );

            const verifyRequests = JSON.parse(
                localStorage.getItem("itRequests")
            ) || [];

            const savedSuccessfully = verifyRequests.some(
                function (request) {
                    return request.id === newRequest.id;
                }
            );

            if (!savedSuccessfully) {
                throw new Error("Request could not be verified in storage.");
            }
        } catch (error) {
            alert("Request could not be saved. Please check browser storage.");
            console.error("Request save error:", error);
            return;
        }

        alert(
            "IT Support Request submitted successfully!\n\n" +
            "Request ID: " + newRequest.id
        );

        requestForm.reset();

        if (softwareGroup) {
            softwareGroup.style.display = "none";
        }

        if (assetGroup) {
            assetGroup.style.display = "none";
        }
    });
}


/* ==================================================
   IT DASHBOARD: CURRENTLY DISPLAYED STATUS
================================================== */

let currentDisplayedStatus = null;


/* ==================================================
   SHOW NEW REQUESTS
================================================== */

function showNewRequests() {
    showRequestsByStatus("New");
}


/* ==================================================
   SHOW REQUESTS BY STATUS
================================================== */

function showRequestsByStatus(status) {
    currentDisplayedStatus = status;

    let requests = [];

    try {
        requests = JSON.parse(
            localStorage.getItem("itRequests")
        ) || [];

        if (!Array.isArray(requests)) {
            requests = [];
        }
    } catch (error) {
        console.error("Could not read requests:", error);
    }

    const requestList = document.getElementById("newRequestsList");
    const requestSection = document.getElementById("newRequestsSection");
    const requestTitle = document.getElementById("requestListTitle");

    if (!requestList) {
        return;
    }

    if (requestSection) {
        requestSection.style.display = "block";
    }

    if (requestTitle) {
        requestTitle.textContent = status + " IT Requests";
    }

    const filteredRequests = requests.filter(function (request) {
        return request.status === status;
    });

    requestList.innerHTML = "";

    if (filteredRequests.length === 0) {
        const emptyCard = document.createElement("div");
        emptyCard.className = "request-card";

        const emptyHeading = document.createElement("h3");
        emptyHeading.textContent = "No " + status + " Requests";

        const emptyMessage = document.createElement("p");
        emptyMessage.textContent =
            'There are currently no requests with "' +
            status +
            '" status.';

        emptyCard.appendChild(emptyHeading);
        emptyCard.appendChild(emptyMessage);
        requestList.appendChild(emptyCard);

        return;
    }

    filteredRequests.forEach(function (request) {
        const requestCard = document.createElement("div");
        requestCard.className = "request-card";

        const heading = document.createElement("h3");
        heading.textContent = request.id;
        requestCard.appendChild(heading);

        function addDetail(label, value) {
            const paragraph = document.createElement("p");
            const strong = document.createElement("strong");

            strong.textContent = label + ": ";
            paragraph.appendChild(strong);

            paragraph.appendChild(
                document.createTextNode(
                    value === undefined ||
                    value === null ||
                    value === ""
                        ? "N/A"
                        : String(value)
                )
            );

            requestCard.appendChild(paragraph);
        }

        addDetail("Employee", request.employeeName);
        addDetail("Employee ID", request.employeeId);
        addDetail("Category", request.category);
        addDetail("Software", request.software);
        addDetail("Asset", request.asset);
        addDetail("Subject", request.subject);
        addDetail("Priority", request.priority);
        addDetail("Description", request.description);
        addDetail("Date", request.createdAt);

        requestCard.appendChild(document.createElement("hr"));

        const assignedLabel = document.createElement("label");
        assignedLabel.textContent = "Assigned To:";
        assignedLabel.htmlFor = "assigned-" + request.id;
        requestCard.appendChild(assignedLabel);

        const assignedSelect = document.createElement("select");
        assignedSelect.id = "assigned-" + request.id;

        const teamOptions = [
            { value: "", text: "Select IT Team Member" },
            { value: "Mohit Boora", text: "Mohit Boora" },
            { value: "Kaleem", text: "Kaleem" }
        ];

        teamOptions.forEach(function (item) {
            const option = document.createElement("option");
            option.value = item.value;
            option.textContent = item.text;
            assignedSelect.appendChild(option);
        });

        assignedSelect.value = request.assignedTo || "";
        requestCard.appendChild(assignedSelect);

        requestCard.appendChild(document.createElement("br"));
        requestCard.appendChild(document.createElement("br"));

        const statusLabel = document.createElement("label");
        statusLabel.textContent = "Status:";
        statusLabel.htmlFor = "status-" + request.id;
        requestCard.appendChild(statusLabel);

        const statusSelect = document.createElement("select");
        statusSelect.id = "status-" + request.id;

        const statuses = [
            "New",
            "Assigned",
            "In Progress",
            "Resolved",
            "Closed"
        ];

        statuses.forEach(function (item) {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            statusSelect.appendChild(option);
        });

        statusSelect.value = request.status;
        requestCard.appendChild(statusSelect);

        requestCard.appendChild(document.createElement("br"));
        requestCard.appendChild(document.createElement("br"));

        const updateButton = document.createElement("button");
        updateButton.type = "button";
        updateButton.textContent = "Update Request";

        updateButton.addEventListener("click", function () {
            updateRequest(request.id);
        });

        requestCard.appendChild(updateButton);
        requestList.appendChild(requestCard);
    });
}


/* ==================================================
   UPDATE REQUEST STATUS / ASSIGNEE
================================================== */

function updateRequest(requestId) {
    let requests = [];

    try {
        requests = JSON.parse(
            localStorage.getItem("itRequests")
        ) || [];

        if (!Array.isArray(requests)) {
            requests = [];
        }
    } catch (error) {
        alert("Could not read saved requests.");
        console.error(error);
        return;
    }

    const request = requests.find(function (item) {
        return item.id === requestId;
    });

    if (!request) {
        alert("Request not found.");
        return;
    }

    const assignedElement = document.getElementById(
        "assigned-" + requestId
    );

    const statusElement = document.getElementById(
        "status-" + requestId
    );

    if (!assignedElement || !statusElement) {
        alert("Request controls not found.");
        return;
    }

    request.assignedTo = assignedElement.value;
    request.status = statusElement.value;

    try {
        localStorage.setItem(
            "itRequests",
            JSON.stringify(requests)
        );
    } catch (error) {
        alert("Could not save the request update.");
        console.error(error);
        return;
    }

    updateDashboardCounts();

    alert("Request updated successfully!");

    if (currentDisplayedStatus) {
        showRequestsByStatus(currentDisplayedStatus);
    }
}


/* ==================================================
   DASHBOARD STATUS COUNTS
================================================== */

function updateDashboardCounts() {
    let requests = [];

    try {
        requests = JSON.parse(
            localStorage.getItem("itRequests")
        ) || [];

        if (!Array.isArray(requests)) {
            requests = [];
        }
    } catch (error) {
        console.error(
            "Could not read requests for dashboard counts:",
            error
        );
    }

    const counts = {
        New: 0,
        Assigned: 0,
        "In Progress": 0,
        Resolved: 0,
        Closed: 0
    };

    requests.forEach(function (request) {
        if (
            request &&
            Object.prototype.hasOwnProperty.call(counts, request.status)
        ) {
            counts[request.status]++;
        }
    });

    const newElement = document.getElementById("newRequestCount");
    const assignedElement = document.getElementById("assignedCount");
    const inProgressElement = document.getElementById("inProgressCount");
    const resolvedElement = document.getElementById("resolvedCount");
    const closedElement = document.getElementById("closedCount");

    if (newElement) {
        newElement.textContent = counts.New;
    }

    if (assignedElement) {
        assignedElement.textContent = counts.Assigned;
    }

    if (inProgressElement) {
        inProgressElement.textContent = counts["In Progress"];
    }

    if (resolvedElement) {
        resolvedElement.textContent = counts.Resolved;
    }

    if (closedElement) {
        closedElement.textContent = counts.Closed;
    }
}


/* ==================================================
   INITIALIZE DASHBOARD COUNTS
================================================== */

updateDashboardCounts();
