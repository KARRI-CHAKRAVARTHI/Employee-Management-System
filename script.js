(async function () {
    const data = await fetch("data.json");
    const res = await data.json();

    let employees = res;
    let selectedEmployeeId = employees[0].id;
    let selectedEmployee = employees[0];

    const employeeList = document.querySelector(".employees__names--list");
    const employeeInfo = document.querySelector(".employees__single--info");
    const searchInput = document.getElementById("searchEmployee");

    // Add Employee - START
    const createEmployee = document.querySelector(".createEmployee");
    const addEmployeeModal = document.querySelector(".addEmployee");
    const addEmployeeForm = document.querySelector(".addEmployee_create");

    createEmployee.addEventListener("click", () => {
        addEmployeeModal.style.display = "flex";
    });

    addEmployeeModal.addEventListener("click", (e) => {
        if (e.target.className === "addEmployee") {
            addEmployeeModal.style.display = "none";
        }
    });

    // Set Employee age to be entered minimum 18 years
    const dobInput = document.querySelector(".addEmployee_create--dob");
    dobInput.max = `${new Date().getFullYear() - 18}-${new Date().toISOString().slice(5, 10)}`;

    addEmployeeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(addEmployeeForm);
        const values = [...formData.entries()];
        let empData = {};
        values.forEach((val) => {
            empData[val[0]] = val[1];
        });
        
        // Using the manually input employee ID
        empData.id = parseInt(empData.id, 10);
        empData.imageUrl = empData.imageUrl || "sample.png";  //default profile image
        employees.push(empData);
        renderEmployees();
        addEmployeeForm.reset();
        addEmployeeModal.style.display = "none";
    });
    // Add Employee - END

    // Select Employee Logic - START
    employeeList.addEventListener("click", (e) => {
        if (e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id) {
            selectedEmployeeId = e.target.id;
            renderEmployees();
            renderSingleEmployee();
        }
        // Employee Delete Logic - START
        if (e.target.tagName === "I") {
            employees = employees.filter((emp) => String(emp.id) !== e.target.parentNode.id);
            if (String(selectedEmployeeId) === e.target.parentNode.id) {
                selectedEmployeeId = employees[0]?.id || -1;
                selectedEmployee = employees[0] || {};
                renderSingleEmployee();
            }
            renderEmployees();
        }
        // Employee Delete Logic - END
    });
    // Select Employee Logic - END

    // Search Employees - START
    searchInput.addEventListener("input", () => {
        renderEmployees();
    });

    // Filter employees based on the search input
    const filterEmployees = (query) => {
        return employees.filter((emp) => {
            const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
            return fullName.includes(query.toLowerCase());
        });
    };

    // Render All Employees Logic - START
    const renderEmployees = () => {
        employeeList.innerHTML = "";
        const searchQuery = searchInput.value;
        const filteredEmployees = filterEmployees(searchQuery);

        filteredEmployees.forEach((emp) => {
            const employee = document.createElement("span");
            employee.classList.add("employees__names--item");
            if (parseInt(selectedEmployeeId, 10) === emp.id) {
                employee.classList.add("selected");
                selectedEmployee = emp;
            }
            employee.setAttribute("id", emp.id);
            employee.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelete">&#10060;</i>`;
            employeeList.append(employee);
        });
    };
    // Render All Employees Logic - END

    // Render Single Employee Logic - START
    const renderSingleEmployee = () => {
        if (selectedEmployeeId === -1) {
            employeeInfo.innerHTML = "";
            return;
        }

        employeeInfo.innerHTML = `
        <img src="${selectedEmployee.imageUrl}" />
        <span class="employees__single--heading">
        ${selectedEmployee.firstName} ${selectedEmployee.lastName} 
        </span>
        <span>ID - ${selectedEmployee.id}</span>
        <span>${selectedEmployee.email}</span>
        <span>Mobile - ${selectedEmployee.contactNumber}</span>
        <span>DOB - ${selectedEmployee.dob}</span>
      `;
    };
    // Render Single Employee Logic - END

    renderEmployees();
    if (selectedEmployee) renderSingleEmployee();
})();
