


const svg = createSvgBackground();

function createSetup() {
	const children = Array.from(document.body.children).filter((child) => {
		return (
			child.tagName.toLowerCase() !== "script" &&
			child.tagName.toLowerCase() !== "style"
		);
	});

	if (children.length > 0) {
		children.forEach((child) => {
			if (child) {
				Object.assign(child.style, {
					position: "relative",
					"z-index": 2
				});
			}
		});
	}
}

function createSvgBackground() {
	createSetup();

	document.body.style.position = "relative";

	const svgElement = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"svg"
	);

	svgElement.setAttribute("width", "100%");
	svgElement.setAttribute("height", "100%");

	Object.assign(svgElement.style, {
		top: "0",
		left: "0",
		bottom: "0",
		right: "0",
		"pointer-event": "none",
		"user-select": "none",
		"z-index": 1,
		position: "absolute"
	});

	document.body.appendChild(svgElement);

	return svgElement;
}

const svgTargets = document.querySelectorAll(".svg-target");
const padding = 30;

createSvgPath();
createSvgPathDot();

window.addEventListener("resize", () => {
	svg.innerHTML = "";
	createSvgPath();
	createSvgPathDot();
});

function createSvgPath() {
	let d = "";
	let prevX = 0;
	let prevY = 0;

	svgTargets.forEach((target, index) => {
		const { x, y, height } = target.getBoundingClientRect();
		let xPos = x + window.scrollX - padding;
		let yPos = y + window.scrollY + height / 2;

		if (index === 0) {
			d += `M ${xPos} ${yPos}`;
		} else {
			if (prevX != xPos) {
				const round = 120;
				const midY = (yPos + prevY) / 2;
				if (xPos < prevX) {
					d += `L ${prevX} ${midY - round}`;
					d += `Q ${prevX} ${midY}, ${prevX - round} ${midY}`;
					d += `L ${xPos + 100} ${midY}`;
					d += `Q ${xPos} ${midY}, ${xPos} ${midY + round}`;
				} else {
					d += `L ${prevX} ${midY - round}`;
					d += `Q ${prevX} ${midY}, ${prevX + round} ${midY}`;
					d += `L ${xPos - 100} ${midY}`;
					d += `Q ${xPos} ${midY}, ${xPos} ${midY + round}`;
				}
			} else {
				d += ` L ${xPos} ${yPos}`;
			}
		}

		prevX = xPos;
		prevY = yPos;
	});

	createPath(d);
	animatePath(createPath(d, true));
}

function animatePath(path) {
	const length = path.getTotalLength();
	path.style.strokeDasharray = length;
	path.style.strokeDashoffset = length;

	window.addEventListener("scroll", function () {
		const { scrollTop: bodyScrollTop } = document.body;
		const { clientHeight, scrollHeight, scrollTop } = document.documentElement;
		const height = scrollHeight - clientHeight;
		const top = bodyScrollTop + scrollTop;
		const scrollpercent = top / height;
		const progression = length * scrollpercent;
		path.style.strokeDashoffset = length - progression;
	});
}

function createPath(d, white) {
	let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.setAttribute("d", d);
	path.setAttribute("fill", "none");
	path.setAttribute("stroke", white ? "#003554" : "#343c48");
	path.setAttribute("stroke-width", "3");
	path.setAttribute("stroke-linejoin", "round");
	path.setAttribute("stroke-linecap", "round");
	path.setAttribute("stroke-dasharray", "1,10");
	svg.appendChild(path);
	return path;
}

function createSvgPathDot() {
	svgTargets.forEach((target) => {
		const { x, y, height } = target.getBoundingClientRect();
		const circle = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"circle"
		);
		const xPos = x - padding;
		const yPos = y + window.scrollY + height / 2;

		circle.setAttribute("cx", xPos);
		circle.setAttribute("cy", yPos);
		circle.setAttribute("r", 5);
		circle.setAttribute("fill", "#ffffff");
		circle.setAttribute("stroke", "#0c1016d9");
		circle.setAttribute("stroke-width", "4");
		svg.appendChild(circle);
	});
}
