document.getElementById("sw_60").addEventListener("click", (click) => {
    window.location.href = "/SW60";
});

document.getElementById("sw_16").addEventListener("click", () => {
    window.location.href = "/SW16";
});

document.getElementById("sw_06").addEventListener("click", () => {
    window.location.href = "/SW06";
});

document.getElementById("sw_60").addEventListener("mouseover", () => {
    document.getElementById("explain_text").textContent = 'Soundwalk 60 is a series of geo-located 60-minute sonic experiences centered on specific cities.';
});

document.getElementById("sw_60").addEventListener("mouseout", () => {
    document.getElementById("explain_text").textContent = 'Welcome to The Walks!';
});

document.getElementById("sw_16").addEventListener("mouseover", () => {
    document.getElementById("explain_text").textContent = 'Soundwalk 16 is a series of 16-minute sonic experiences exploring the concept of non-places in modern city life, triggered by image input using image classification.';
});

document.getElementById("sw_60").addEventListener("mouseout", () => {
    document.getElementById("explain_text").textContent = 'Welcome to The Walks!';
});

document.getElementById("sw_06").addEventListener("mouseover", () => {
    document.getElementById("explain_text").textContent = 'Soundwalk 06 is a series of 6-minute walking exploration prompts delivered through AI-generated voice around non-places';
});

document.getElementById("sw_60").addEventListener("mouseout", () => {
    document.getElementById("explain_text").textContent = 'Welcome to The Walks!';
});
