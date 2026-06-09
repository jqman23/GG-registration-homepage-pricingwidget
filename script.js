const pricingBtn = document.getElementById("pricingBtn");
const backBtn = document.getElementById("backBtn");
const mainView = document.getElementById("mainView");
const pricingView = document.getElementById("pricingView");
const shell = document.getElementById("ggWidgetShell");

const earlyBirdInput = document.getElementById("earlyBird");
const studentInput = document.getElementById("student");
const livedInput = document.getElementById("lived");
const ceuInput = document.getElementById("ceu");
const earlyBirdInfo = earlyBirdInput.parentElement.querySelector(".infoIcon");
const ceuInfo = ceuInput.parentElement.querySelector(".infoIcon");

const livedLabel = livedInput.parentElement;
const studentLabel = studentInput.parentElement;

const skillRegistration = document.getElementById("skillRegistration");
const globalRegistration = document.getElementById("globalRegistration");

const groupRegistration = document.getElementById("groupRegistration");
const groupSizeInput = document.getElementById("groupSize");
const groupSizeValue = document.getElementById("groupSizeValue");
const groupHalfSkillsInput = document.getElementById("groupHalfSkills");
const groupFullSkillsInput = document.getElementById("groupFullSkills");
const groupCeusInput = document.getElementById("groupCeus");

const bundleNotice = document.getElementById("bundleNotice");
const registrationLabel = document.querySelector(".calcSection:first-child .calcLabel");
const priceTopLabel = document.querySelector(".priceTop");

pricingBtn.addEventListener("click", () => {
  mainView.style.display = "none";
  pricingView.style.display = "block";
  updatePrice();
});

backBtn.addEventListener("click", () => {
  pricingView.style.display = "none";
  mainView.style.display = "block";
});

let instituteCount = 1;

document.querySelectorAll(".skillBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (groupRegistration.checked) return;

    document.querySelectorAll(".skillBtn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
    instituteCount = parseInt(btn.dataset.count);
    updatePrice();
  });
});

[
  "earlyBird",
  "student",
  "lived",
  "ceu",
  "groupRegistration",
  "groupCeus"
].forEach(id => {
  document.getElementById(id).addEventListener("change", updatePrice);
});

document.getElementById("skillRegistration").addEventListener("change", () => {
  if (!skillRegistration.checked && !globalRegistration.checked) {
    globalRegistration.checked = true;
  }
  if (globalRegistration.checked && !groupRegistration.checked) {
    earlyBirdInput.checked = true;
  }
  updatePrice();
});

document.getElementById("globalRegistration").addEventListener("change", () => {
  if (!skillRegistration.checked && !globalRegistration.checked) {
    globalRegistration.checked = true;
  }
  if (globalRegistration.checked && !groupRegistration.checked) {
    earlyBirdInput.checked = true;
  }
  updatePrice();
});

groupSizeInput.addEventListener("input", updatePrice);
groupHalfSkillsInput.addEventListener("input", updatePrice);
groupFullSkillsInput.addEventListener("input", updatePrice);
groupCeusInput.addEventListener("input", updatePrice);

function clampNumber(input, min, max) {
  let value = parseInt(input.value, 10);
  if (isNaN(value)) value = min;
  if (value < min) value = min;
  if (max !== null && value > max) value = max;
  input.value = value;
  return value;
}

function updatePrice() {
  const groupMode = groupRegistration.checked;

  if (groupMode) {
    shell.classList.add("groupMode");

    globalRegistration.checked = true;
    skillRegistration.checked = true;
    globalRegistration.disabled = true;
    skillRegistration.disabled = true;

    globalRegistration.parentElement.classList.add("lockedToggle");
    skillRegistration.parentElement.classList.add("lockedToggle");

    studentInput.checked = false;
    livedInput.checked = false;

    document.querySelectorAll(".individualOnly")
      .forEach(row => row.style.display = "flex");

    studentInput.disabled = true;
    livedInput.disabled = true;

    studentInput.parentElement.classList.add("disabled");
    livedInput.parentElement.classList.add("disabled");

    studentInput.parentElement.setAttribute(
      "data-tooltip",
      "Student Discounts do not typically factor into Group Registration pricing."
    );
    livedInput.parentElement.setAttribute(
      "data-tooltip",
      "Lived Experience Scholarships apply to individual registrations."
    );

    earlyBirdInfo.setAttribute(
      "data-tooltip",
      "A 10% Early Bird discount is automatically applied to any 10+ group that completes the registration form before July 31. To complete the registration form groups only need to submit basic information about their organization."
    );
    ceuInfo.setAttribute(
      "data-tooltip",
      "Select how many group members will claim CEUs. CEUs cost $50 per registrant."
    );

  } else {
    shell.classList.remove("groupMode");
    shell.classList.remove("tierSmall", "tierMedium", "tierLarge");

    globalRegistration.disabled = false;
    skillRegistration.disabled = false;
    globalRegistration.parentElement.classList.remove("lockedToggle");
    skillRegistration.parentElement.classList.remove("lockedToggle");

    document.querySelectorAll(".individualOnly")
      .forEach(row => row.style.display = "flex");

    studentInput.disabled = false;
    livedInput.disabled = false;
    studentInput.parentElement.classList.remove("disabled");
    livedInput.parentElement.classList.remove("disabled");
    studentInput.parentElement.removeAttribute("data-tooltip");
    livedInput.parentElement.removeAttribute("data-tooltip");

    earlyBirdInfo.setAttribute(
      "data-tooltip",
      "Participants have until July 31st to take advantage of the 10% Early Bird Discount."
    );
    ceuInfo.setAttribute(
      "data-tooltip",
      "Any number of CEUs can be earned at the Global Gathering for a flat $50 fee."
    );

    document.querySelectorAll(".skillBtn")
      .forEach(btn => btn.classList.remove("hasQty"));
  }

  const earlyBird = earlyBirdInput.checked;
  const student = studentInput.checked;
  const lived = livedInput.checked;
  const ceu = ceuInput.checked;

  const skillSelected = skillRegistration.checked;
  const globalSelected = globalRegistration.checked;

  const notice = document.getElementById("pricingNotice");
  const tierNudge = document.getElementById("tierNudge");
  tierNudge.style.display = "none";
  tierNudge.innerHTML = "";
  shell.classList.remove("showTierNudge", "noAdjustments");

  document.getElementById("skillCountSection").style.display =
    skillSelected ? "block" : "none";

  if (!groupMode && skillSelected && !globalSelected) {
    earlyBirdInput.checked = false;
    studentInput.checked = false;
    earlyBirdInput.disabled = true;
    studentInput.disabled = true;
    livedInput.disabled = false;

    const earlyBirdLabel = earlyBirdInput.parentElement;
    earlyBirdLabel.classList.add("disabled");
    studentLabel.classList.add("disabled");
    livedLabel.classList.remove("disabled");

    earlyBirdLabel.setAttribute(
      "data-tooltip",
      "Take advantage of the Early Bird Discount by participating in the Global Gathering."
    );
    studentLabel.setAttribute(
      "data-tooltip",
      "The Student Discount does not apply towards Skill Building Institutes."
    );
    livedLabel.removeAttribute("data-tooltip");

    const ceuLabel = document.getElementById("ceu")
      .parentElement
      .querySelector(".infoIcon");
    ceuLabel.setAttribute(
      "data-tooltip",
      "CEUs are included at no additional cost for Skill Building Institutes."
    );

  } else if (!groupMode) {
    earlyBirdInput.disabled = false;
    studentInput.disabled = false;
    livedInput.disabled = false;

    const earlyBirdLabel = earlyBirdInput.parentElement;
    earlyBirdLabel.classList.remove("disabled");
    studentLabel.classList.remove("disabled");
    livedLabel.classList.remove("disabled");
    earlyBirdLabel.removeAttribute("data-tooltip");
    studentLabel.removeAttribute("data-tooltip");
    livedLabel.removeAttribute("data-tooltip");

    const ceuLabel = document.getElementById("ceu")
      .parentElement
      .querySelector(".infoIcon");
    ceuLabel.setAttribute(
      "data-tooltip",
      "Any number of CEUs can be earned at the Global Gathering for a flat $50 fee."
    );
  }

  let price = 0;
  let text = "";
  let adjustments = [];

  if (groupMode) {
    const groupSize = parseInt(groupSizeInput.value, 10);
    groupSizeValue.textContent = groupSize;
    shell.classList.remove("tierSmall", "tierMedium", "tierLarge");

    if (groupSize >= 40) {
      shell.classList.add("tierLarge");
    } else if (groupSize >= 20) {
      shell.classList.add("tierMedium");
    } else {
      shell.classList.add("tierSmall");
    }

    const halfSkills = clampNumber(groupHalfSkillsInput, 0, groupSize);
    const fullSkills = clampNumber(groupFullSkillsInput, 0, groupSize);
    const groupCeus = ceuInput.checked ? clampNumber(groupCeusInput, 0, 15) : 0;

    const halfDayBtn = groupHalfSkillsInput
      .closest(".skillOptionLine")
      .querySelector(".skillBtn");
    const fullDayBtn = groupFullSkillsInput
      .closest(".skillOptionLine")
      .querySelector(".skillBtn");

    halfDayBtn.classList.toggle("hasQty", halfSkills > 0);
    fullDayBtn.classList.toggle("hasQty", fullSkills > 0);

    let groupRate = 150;
    if (groupSize >= 40) {
      groupRate = 90;
    } else if (groupSize >= 20) {
      groupRate = 120;
    }

    const globalSubtotal = groupSize * groupRate;
    price = globalSubtotal;
    text = `${groupSize} Global Gathering registrations at $${groupRate} each`;

    if (groupSize >= 16 && groupSize <= 19) {
      tierNudge.innerHTML =
        `Adding just <strong>${20 - groupSize}</strong> additional registrant${20 - groupSize === 1 ? "" : "s"} lowers your overall cost.`;
      tierNudge.style.display = "block";
      shell.classList.add("showTierNudge");
    }

    if (groupSize >= 30 && groupSize <= 39) {
      tierNudge.innerHTML =
        `Adding just <strong>${40 - groupSize}</strong> additional registrant${40 - groupSize === 1 ? "" : "s"} lowers your overall cost.`;
      tierNudge.style.display = "block";
      shell.classList.add("showTierNudge");
    }

    if (earlyBird) {
      const earlyBirdDiscount = globalSubtotal * .10;
      price -= earlyBirdDiscount;
      adjustments.push(`$${earlyBirdDiscount.toFixed(2)} Early Bird Discount applied`);
    }

    if (halfSkills > 0) {
      const halfSkillTotal = halfSkills * 25;
      price += halfSkillTotal;
      adjustments.push(`$${halfSkillTotal.toFixed(2)} Half-Day Skill Institute registrations added (${halfSkills} × $25)`);
    }

    if (fullSkills > 0) {
      const fullSkillTotal = fullSkills * 65;
      price += fullSkillTotal;
      adjustments.push(`$${fullSkillTotal.toFixed(2)} Full-Day Skill Institute registrations added (${fullSkills} × $65)`);
    }

    if (groupCeus > 0) {
      const ceuTotal = groupCeus * 50;
      price += ceuTotal;
      adjustments.push(`$${ceuTotal.toFixed(2)} CEU registrations added (${groupCeus} × $50)`);
    }
  }

  if (!groupMode && globalSelected && !skillSelected) {
    price = 175;
    text = "Global Gathering (Oct 7-8)";

    if (earlyBird) {
      price *= .9;
      adjustments.push("$17.50 (10%) Early Bird Discount applied");
    }
    if (student) {
      price -= 75;
      adjustments.push("$75 Student Discount applied");
    }
    if (lived) {
      price = 0;
      adjustments = ["Lived Experience Scholarship applied"];
    }
    if (ceu) {
      price += 50;
      adjustments.push("$50 CEU cost added");
    }
  }

  if (!groupMode && skillSelected && !globalSelected) {
    price = instituteCount === 1 ? 50 : 90;
    text = instituteCount === 1
      ? "Half-Day Skill Building Institute (Oct 6)"
      : "Full-Day Skill Building Institute (Oct 6)";

    if (lived) {
      price = 0;
      adjustments = ["Lived Experience Scholarship applied"];
    }
    if (ceu) {
      adjustments.push("CEUs included at no additional cost");
    }
  }

  if (!groupMode && skillSelected && globalSelected) {
    const skillPrice = instituteCount === 1 ? 50 : 90;
    price = 175 + skillPrice;
    text = instituteCount === 1
      ? "Half-Day Skill Building Institute & Global Gathering (Oct 6-8)"
      : "Full-Day Skill Building Institute & Global Gathering (Oct 6-8)";

    if (earlyBird) {
      price *= .9;
      adjustments.push(
        instituteCount === 1
          ? "$22.50 Early Bird Discount applied"
          : "$26.50 Early Bird Discount applied"
      );
    }

    price -= 25;
    adjustments.push("$25 Bundle Discount applied");

    if (student) {
      price -= 75;
      adjustments.push("$75 Student Discount applied");
    }
    if (lived) {
      price = 0;
      adjustments = ["Lived Experience Scholarship applied"];
    }
    if (ceu) {
      price += 50;
      adjustments.push("$50 CEU fee added");
    }
  }

  document.getElementById("finalPrice").textContent =
    `$${price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  document.getElementById("priceBreakdown").textContent = text;
  notice.innerHTML = adjustments.join("<br>");

  if (groupMode && adjustments.length === 0) {
    shell.classList.add("noAdjustments");
  } else {
    shell.classList.remove("noAdjustments");
  }

  if (groupMode) {
    registrationLabel.textContent = "Group Registration Options";
    priceTopLabel.textContent = "Estimated Group Registration Cost";
    bundleNotice.textContent =
      "Groups of 10 or more receive additional discounts. Skill Institutes can be purchased for any number of group members.";
    bundleNotice.style.display = "block";
  } else {
    registrationLabel.textContent = "Individual Registration Options";
    priceTopLabel.textContent = "Estimated Individual Registration Cost";
    bundleNotice.textContent =
      "By participating in both the Global Gathering and a half or full day of Skill Building Institutes, participants receive a Bundle Discount.";
    bundleNotice.style.display =
      (skillSelected && globalSelected) ? "block" : "none";
  }
}

updatePrice();
document.getElementById("skillCountSection").style.display = "none";

function emitHeight() {
  const height = document.getElementById("ggWidgetShell").scrollHeight + 32;
  window.parent.postMessage({ ggWidgetHeight: height }, "*");
}

new ResizeObserver(emitHeight).observe(document.getElementById("ggWidgetShell"));
emitHeight();
