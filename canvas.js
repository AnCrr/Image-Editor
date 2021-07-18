window.addEventListener("load", () => {
  const canvas = document.querySelector("canvas");
  const colorsContainer = document.getElementById("colors");
  const uploader = document.getElementById("uploader");
  const radContainer = document.getElementById("rad");
  const actionsContainer = document.querySelector(".actions");
  const radSpan = document.getElementById("radval");
  const ctx = canvas.getContext("2d");
  const reader = new FileReader();
  const img = new Image();
  const minRad = 0.5;
  const maxRad = 100;
  const defaultRad = 10;
  const interval = 5;
  const COLORS = [
    "black",
    "grey",
    "white",
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet",
  ];

  let radius = 10;
  let dragging = false;
  let isCleaningCanvas = false;
  canvas.height = 600;
  canvas.width = 600;

  const setRadius = (value) => {
    if (value < minRad) value = minRad;
    if (value > maxRad) value = maxRad;

    radius = value;
    ctx.lineWidth = radius * 2;
    radSpan.innerHTML = radius;
  };

  const onSave = () => {
    const link = document.createElement("a");
    link.setAttribute("download", "MintyPaper.png");
    link.setAttribute(
      "href",
      canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
    );
    link.click();
    alert("image has been downloaded locally");
  };

  const onClear = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    isCleaningCanvas = true;
    ctx.globalCompositeOperation = "destination-out";
  };

  const handleMouseDown = () => {
    dragging = true;
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(e.offsetX, e.offsetY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    }
  };

  const handleMouseUp = () => {
    dragging = false;
    isCleaningCanvas = false;
    ctx.globalCompositeOperation = "source-over";
    ctx.beginPath();
  };

  const handleClickColor = (e) => {
    const target = e.target;
    const color = target.dataset.color;

    colorsContainer.childNodes.forEach((colorElem) =>
      colorElem.classList.remove("active")
    );
    target.classList.add("active");

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
  };

  const handleClickCounter = (e) => {
    const target = e.target;
    const value = target.dataset.value;

    switch (value) {
      case "dec":
        setRadius(radius + interval);
        break;
      case "inc":
        setRadius(radius - interval);
        break;
      default:
        break;
    }
  };

  const handleClickAction = (e) => {
    const target = e.target;
    const value = target.dataset.value;

    switch (value) {
      case "save":
        onSave();
        break;
      case "clear":
        onClear();
        break;
      default:
        break;
    }
  };

  const handleUploadImage = (e) => {
    const target = e.target;
    reader.onload = () => {
      img.onload = () => {
        img.width = canvas.width;
        img.height = canvas.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(target.files[0]);
  };

  const initEventListeners = () => {
    canvas.addEventListener("contextmenu", handleContextMenu);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    colorsContainer.addEventListener("pointerdown", handleClickColor);
    radContainer.addEventListener("pointerdown", handleClickCounter);
    actionsContainer.addEventListener("pointerdown", handleClickAction);
    uploader.addEventListener("change", handleUploadImage);
  };

  const renderColors = () => {
    const renderColor = (color) => {
      const elem = document.createElement("div");
      elem.classList.add("swatch");
      elem.style.backgroundColor = color;
      elem.dataset.color = color;

      if (color === "black") {
        elem.classList.add("active");
      }

      colorsContainer.appendChild(elem);
    };

    COLORS.forEach(renderColor);
  };

  const render = () => {
    renderColors();
    setRadius(defaultRad);
    initEventListeners();
  };

  render();
});
