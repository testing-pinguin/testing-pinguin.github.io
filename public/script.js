let currentQuestions = []; // uložíme aktuální otázky

async function start() {
    const countInput = document.getElementById("count");
    let count = parseInt(countInput.value);

    if (isNaN(count) || count < 1) count = 5;
    if (count > 50) count = 50;

    // načtení otázek z backendu
    let res = await fetch(`/api/questions?count=${count}`);
    let questions = await res.json();

    currentQuestions = questions; // uložíme pro vyhodnocení

    let quizDiv = document.getElementById("quiz");
    quizDiv.innerHTML = "";

    questions.forEach((q, index) => {
        let block = document.createElement("div");
        block.style.marginBottom = "15px";
        block.innerHTML = `
            <p><strong>Otázka ${index + 1}:</strong> ${q.text_uryvek}</p>
            <input id="answer-${index}" placeholder="Zadejte název jevu">
        `;
        quizDiv.appendChild(block);
    });

    // zobrazíme tlačítko pro vyhodnocení
    const submitButton = document.getElementById("submit");
    submitButton.style.display = "inline-block";
    submitButton.onclick = checkAnswers;

    // vymazat předchozí výsledky
    document.getElementById("result").innerHTML = "";
}

function checkAnswers() {
    let score = 0;
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    currentQuestions.forEach((q, index) => {
        const userAnswer = document.getElementById(`answer-${index}`).value.trim().toLowerCase();
        const correctAnswer = q.jev.trim().toLowerCase();

        let p = document.createElement("p");
        if (userAnswer === correctAnswer) {
            score++;
            p.textContent = `Správně: "${q.text_uryvek}" → ${q.jev}`;
            p.className = "correct";
        } else {
            p.textContent = `Špatně: "${q.text_uryvek}" → zadáno: ${userAnswer || "(prázdné)"}; správně: ${q.jev}`;
            p.className = "incorrect";
        }
        resultDiv.appendChild(p);
    });

    // souhrn výsledků
    const total = currentQuestions.length;
    const percent = total > 0 ? ((score / total) * 100).toFixed(1) : 0;

    const summary = document.createElement("p");
    summary.innerHTML = `<strong>Skóre: ${score} / ${total} (${percent}%)</strong>`;
    summary.style.marginTop = "15px";
    resultDiv.appendChild(summary);
}