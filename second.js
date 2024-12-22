document.addEventListener("DOMContentLoaded", () => {
    const numSubjects = localStorage.getItem("numSubjects");
    const semester = localStorage.getItem("semester");

    if (!numSubjects || !semester) {
        alert("Missing data! Returning to the first page.");
        window.location.href = "index.html";
        return;
    }

    const tbody = document.getElementById("dynamic-subjects");

    for (let i = 1; i <= numSubjects; i++) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" name="subject-${i}-name" placeholder="Subject ${i}" required></td>
            <td>
                <select name="subject-${i}-credits" class="credits-dropdown" required>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            </td>
            <td><input type="number" name="subject-${i}-mse1" class="mse1-input" min="0" max="50"></td>
            <td><input type="number" name="subject-${i}-mse2" class="mse2-input" min="0" max="50"></td>
            <td><input type="number" name="subject-${i}-internals" min="0" max="30" required></td>
        `;
        tbody.appendChild(row);
    }

    const nextButton = document.getElementById("next-button");
    nextButton.addEventListener("click", () => {
        const subjects = [];

        for (let i = 1; i <= numSubjects; i++) {
            const name = document.querySelector(`[name="subject-${i}-name"]`).value;
            const credits = document.querySelector(`[name="subject-${i}-credits"]`).value;
            const mse1 = document.querySelector(`[name="subject-${i}-mse1"]`).value;
            const mse2 = document.querySelector(`[name="subject-${i}-mse2"]`).value;
            const internals = document.querySelector(`[name="subject-${i}-internals"]`).value;

            if (!name || !credits || !internals || (credits > 1 && (!mse1 || !mse2))) {
                alert("Please fill in all required fields.");
                return;
            }

            subjects.push({
                name,
                credits: parseInt(credits),
                mse1: parseFloat(mse1) || 0,
                mse2: parseFloat(mse2) || 0,
                internals: parseFloat(internals),
                cia: calculateCIA(parseFloat(mse1), parseFloat(mse2), parseFloat(internals), parseInt(credits)),
                see: 0 // Placeholder for SEE marks
            });
        }

        localStorage.setItem("subjects", JSON.stringify(subjects));
        window.location.href = "third.html";
    });

    function calculateCIA(mse1, mse2, internals, credits) {
        if (credits === 1) {
            return internals; // No MSE for 1-credit subjects
        }

        if (credits === 2) {
            const mse1Scaled = (mse1 / 40) * 30;
            const mse2Scaled = (mse2 / 40) * 30;
            return mse1Scaled + mse2Scaled + internals; // Internals are out of 40
        }

        if (credits === 3) {
            const averageMSE = (mse1 + mse2) / 2;
            const scaledMSE = (averageMSE / 40) * 40;
            return scaledMSE + internals;
        }

        if (credits === 4) {
            const mseTotal = (mse1 + mse2) / 80;
            const scaledMSE = mseTotal * 30;
            return scaledMSE + internals; // Internals are out of 30, combined lab and assignments
        }

        return 0;
    }
});
