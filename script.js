document.getElementById("proceedButton").addEventListener("click", () => {
    const semester = document.getElementById("semester").value;
    const numSubjects = document.getElementById("numSubjects").value;

    if (!numSubjects || numSubjects <= 0) {
        alert("Please enter a valid number of subjects.");
        return;
    }

    // Save the data
    localStorage.setItem("semester", semester);
    localStorage.setItem("numSubjects", numSubjects);

    alert("Semester and number of subjects saved!");

    // Navigate to the second page
    window.location.href = "second.html";
});
