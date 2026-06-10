const pricingBtn         = document.getElementById("pricingBtn");
const skillInstitutesBtn = document.getElementById("skillInstitutesBtn");
const backBtn            = document.getElementById("backBtn");
const skillViewBackBtn   = document.getElementById("skillViewBackBtn");
const resetBtn           = document.getElementById("resetBtn");
const mainView           = document.getElementById("mainView");
const pricingView        = document.getElementById("pricingView");
const skillView          = document.getElementById("skillView");
const shell              = document.getElementById("ggWidgetShell");
const calcLeft           = document.getElementById("calcLeft");

const earlyBirdInput      = document.getElementById("earlyBird");
const studentInput        = document.getElementById("student");
const livedInput          = document.getElementById("lived");
const ceuInput            = document.getElementById("ceu");
const earlyBirdInfo       = earlyBirdInput.parentElement.querySelector(".infoIcon");
const ceuInfo             = ceuInput.parentElement.querySelector(".infoIcon");

const livedLabel   = livedInput.parentElement;
const studentLabel = studentInput.parentElement;

const skillRegistration  = document.getElementById("skillRegistration");
const globalRegistration = document.getElementById("globalRegistration");

const groupRegistration    = document.getElementById("groupRegistration");
const groupSizeInput       = document.getElementById("groupSize");
const groupSizeValue       = document.getElementById("groupSizeValue");
const groupHalfSkillsInput = document.getElementById("groupHalfSkills");
const groupFullSkillsInput = document.getElementById("groupFullSkills");
const groupCeusInput       = document.getElementById("groupCeus");

const bundleNotice     = document.getElementById("bundleNotice");
const registrationLabel = document.querySelector(".calcSection:first-child .calcLabel");
const priceTopLabel    = document.getElementById("priceTopLabel");

const iconSkillGroup  = document.getElementById("iconSkillGroup");
const iconGlobalGroup = document.getElementById("iconGlobalGroup");
const iconDivider     = document.getElementById("iconDivider");

/* ── VIEW NAVIGATION ── */
pricingBtn.addEventListener("click", () => {
  mainView.style.display = "none";
  pricingView.style.display = "block";
  updatePrice();
});

backBtn.addEventListener("click", () => {
  pricingView.style.display = "none";
  mainView.style.display = "block";
});

skillInstitutesBtn.addEventListener("click", () => {
  mainView.style.display = "none";
  skillView.style.display = "block";
});

skillViewBackBtn.addEventListener("click", () => {
  skillView.style.display = "none";
  mainView.style.display = "block";
});

/* ── RESET ── */
resetBtn.addEventListener("click", resetToDefaults);

function resetToDefaults() {
  globalRegistration.checked = true;
  skillRegistration.checked  = false;
  earlyBirdInput.checked     = true;
  studentInput.checked       = false;
  livedInput.checked         = false;
  ceuInput.checked           = false;
  groupRegistration.checked  = false;
  groupSizeInput.value       = 10;
  groupHalfSkillsInput.value = 0;
  groupFullSkillsInput.value = 0;
  groupCeusInput.value       = 0;
  instituteCount             = 1;

  document.querySelectorAll(".skillBtn").forEach((b, i) => {
    b.classList.toggle("active", i === 0);
  });

  updatePrice();
}

/* ── SKILL BUTTONS ── */
let instituteCount = 1;

document.querySelectorAll(".skillBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (groupRegistration.checked) return;
    document.querySelectorAll(".skillBtn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    instituteCount = parseInt(btn.dataset.count);
    updatePrice();
  });
});

/* ── CHANGE LISTENERS ── */
["earlyBird","student","lived","ceu","groupRegistration","groupCeus"]
  .forEach(id => document.getElementById(id).addEventListener("change", updatePrice));

/* ── REGISTRATION CARD TOGGLE LOGIC ── */
/* mousedown blocks the no-op case before the browser can toggle the checkbox.
   change handles all valid state transitions. */
globalRegistration.addEventListener("click", () => {
  if (groupRegistration.checked) return;
  // checked now reflects the NEW state after the click
  if (!globalRegistration.checked && !skillRegistration.checked) {
    // would leave nothing selected — block
    globalRegistration.checked = true;
  } else if (!globalRegistration.checked && skillRegistration.checked) {
    // both were selected, clicked gathering → keep only gathering
    globalRegistration.checked = true;
    skillRegistration.checked = false;
  }
  if (globalRegistration.checked) earlyBirdInput.checked = true;
  updatePrice();
});

skillRegistration.addEventListener("click", () => {
  if (groupRegistration.checked) return;
  if (!skillRegistration.checked && !globalRegistration.checked) {
    // would leave nothing selected — block
    skillRegistration.checked = true;
  } else if (!skillRegistration.checked && globalRegistration.checked) {
    // both were selected, clicked skill → keep only skill
    skillRegistration.checked = true;
    globalRegistration.checked = false;
  }
  updatePrice();
});

groupSizeInput.addEventListener("input", updatePrice);
groupHalfSkillsInput.addEventListener("input", updatePrice);
groupFullSkillsInput.addEventListener("input", updatePrice);
groupCeusInput.addEventListener("input", updatePrice);

/* ── HELPERS ── */
function clampNumber(input, min, max) {
  let value = parseInt(input.value, 10);
  if (isNaN(value)) value = min;
  if (value < min)  value = min;
  if (max !== null && value > max) value = max;
  input.value = value;
  return value;
}

function updateCalcLeftBorder(globalSel, skillSel) {
  calcLeft.classList.remove("borderSkill", "borderBoth");
  if (skillSel && globalSel) {
    calcLeft.classList.add("borderBoth");
  } else if (skillSel && !globalSel) {
    calcLeft.classList.add("borderSkill");
  }
  /* default (global only or neither) keeps the navy border from CSS */
}

function updatePriceIcons(globalSel, skillSel) {
  iconSkillGroup.style.display  = skillSel  ? "flex" : "none";
  iconGlobalGroup.style.display = globalSel ? "flex" : "none";
  iconDivider.style.display     = (skillSel && globalSel) ? "block" : "none";
}

/* ── MAIN UPDATE ── */
function updatePrice() {
  const groupMode   = groupRegistration.checked;
  const skillSelected  = skillRegistration.checked;
  const globalSelected = globalRegistration.checked;

  /* ── group mode UI ── */
  if (groupMode) {
    shell.classList.add("groupMode");

    globalRegistration.checked  = true;
    skillRegistration.checked   = true;
    globalRegistration.disabled = true;
    skillRegistration.disabled  = true;

    globalRegistration.parentElement.classList.add("lockedToggle");
    skillRegistration.parentElement.classList.add("lockedToggle");

    document.querySelectorAll(".individualOnly").forEach(row => row.style.display = "flex");

    studentInput.checked = false;
    livedInput.checked   = false;
    studentInput.disabled = true;
    livedInput.disabled   = true;

    studentInput.parentElement.classList.add("disabled");
    livedInput.parentElement.classList.add("disabled");

    studentInput.parentElement.setAttribute("data-tooltip", "Student Discounts do not typically factor into Group Registration pricing.");
    livedInput.parentElement.setAttribute("data-tooltip", "Lived Experience Scholarships apply to individual registrations.");

    earlyBirdInfo.setAttribute("data-tooltip", "A 10% Early Bird discount is automatically applied to any 10+ group that completes the registration form before July 31. To complete the registration form groups only need to submit basic information about their organization.");
    ceuInfo.setAttribute("data-tooltip", "Select how many group members will claim CEUs. CEUs cost $50 per registrant.");

  } else {
    shell.classList.remove("groupMode", "tierSmall", "tierMedium", "tierLarge");

    globalRegistration.disabled = false;
    skillRegistration.disabled  = false;
    globalRegistration.parentElement.classList.remove("lockedToggle");
    skillRegistration.parentElement.classList.remove("lockedToggle");

    document.querySelectorAll(".individualOnly").forEach(row => row.style.display = "flex");

    studentInput.disabled = false;
    livedInput.disabled   = false;
    studentInput.parentElement.classList.remove("disabled");
    livedInput.parentElement.classList.remove("disabled");
    studentInput.parentElement.removeAttribute("data-tooltip");
    livedInput.parentElement.removeAttribute("data-tooltip");

    earlyBirdInfo.setAttribute("data-tooltip", "Participants have until July 31st to take advantage of the 10% Early Bird Discount.");
    ceuInfo.setAttribute("data-tooltip", "Any number of CEUs can be earned at the Global Gathering for a flat $50 fee.");

    document.querySelectorAll(".skillBtn").forEach(btn => btn.classList.remove("hasQty"));
  }

  const earlyBird = earlyBirdInput.checked;
  const student   = studentInput.checked;
  const lived     = livedInput.checked;
  const ceu       = ceuInput.checked;

  /* effective selections (group locks both on) */
  const effSkill  = groupMode ? true : skillSelected;
  const effGlobal = groupMode ? true : globalSelected;

  updateCalcLeftBorder(effGlobal, effSkill);
  updatePriceIcons(effGlobal, effSkill);

  const notice   = document.getElementById("pricingNotice");
  const tierNudge = document.getElementById("tierNudge");
  tierNudge.style.display = "none";
  tierNudge.innerHTML = "";
  shell.classList.remove("showTierNudge", "noAdjustments");

  document.getElementById("skillCountSection").style.display =
    (groupMode ? true : skillSelected) ? "block" : "none";

  /* ── disable adjustments when skill-only ── */
  if (!groupMode && skillSelected && !globalSelected) {
    earlyBirdInput.checked = false;
    studentInput.checked   = false;
    earlyBirdInput.disabled = true;
    studentInput.disabled   = true;
    livedInput.disabled     = false;

    earlyBirdInput.parentElement.classList.add("disabled");
    studentLabel.classList.add("disabled");
    livedLabel.classList.remove("disabled");

    earlyBirdInput.parentElement.setAttribute("data-tooltip", "Take advantage of the Early Bird Discount by participating in the Global Gathering.");
    studentLabel.setAttribute("data-tooltip", "The Student Discount does not apply towards Skill Building Institutes.");
    livedLabel.removeAttribute("data-tooltip");

    ceuInput.parentElement.querySelector(".infoIcon")
      .setAttribute("data-tooltip", "CEUs are included at no additional cost for Skill Building Institutes.");

  } else if (!groupMode) {
    earlyBirdInput.disabled = false;
    studentInput.disabled   = false;
    livedInput.disabled     = false;

    earlyBirdInput.parentElement.classList.remove("disabled");
    studentLabel.classList.remove("disabled");
    livedLabel.classList.remove("disabled");
    earlyBirdInput.parentElement.removeAttribute("data-tooltip");
    studentLabel.removeAttribute("data-tooltip");
    livedLabel.removeAttribute("data-tooltip");

    ceuInput.parentElement.querySelector(".infoIcon")
      .setAttribute("data-tooltip", "Any number of CEUs can be earned at the Global Gathering for a flat $50 fee.");
  }

  let price = 0;
  let text  = "";
  let adjustments = [];

  /* ── GROUP pricing ── */
  if (groupMode) {
    const groupSize = parseInt(groupSizeInput.value, 10);
    groupSizeValue.textContent = groupSize;
    shell.classList.remove("tierSmall", "tierMedium", "tierLarge");

    if (groupSize >= 50)      shell.classList.add("tierLarge");
    else if (groupSize >= 30) shell.classList.add("tierMedium");
    else                      shell.classList.add("tierSmall");

    const halfSkills = clampNumber(groupHalfSkillsInput, 0, groupSize);
    const fullSkills = clampNumber(groupFullSkillsInput, 0, groupSize);
    const groupCeus  = ceuInput.checked ? clampNumber(groupCeusInput, 0, 15) : 0;

    groupHalfSkillsInput.closest(".skillOptionLine").querySelector(".skillBtn")
      .classList.toggle("hasQty", halfSkills > 0);
    groupFullSkillsInput.closest(".skillOptionLine").querySelector(".skillBtn")
      .classList.toggle("hasQty", fullSkills > 0);

    let groupRate = 150;
    if      (groupSize >= 50) groupRate = 90;
    else if (groupSize >= 40) groupRate = 105;
    else if (groupSize >= 30) groupRate = 120;
    else if (groupSize >= 20) groupRate = 135;

    const globalSubtotal = groupSize * groupRate;
    price = globalSubtotal;
    text  = `${groupSize} Global Gathering registrations at $${groupRate} each`;

    const nudgeThresholds = [20, 30, 40, 50];
    const nextTier = nudgeThresholds.find(t => groupSize < t);
    if (nextTier && nextTier - groupSize <= 4) {
      const diff = nextTier - groupSize;
      tierNudge.innerHTML = `Adding just <strong>${diff}</strong> more registrant${diff === 1 ? "" : "s"} lowers your per-person cost.`;
      tierNudge.style.display = "block";
      shell.classList.add("showTierNudge");
    }

    if (earlyBird) {
      const d = globalSubtotal * .10;
      price -= d;
      adjustments.push(`−$${d.toFixed(2)} Early Bird Discount`);
    }
    if (halfSkills > 0) {
      const t = halfSkills * 25;
      price += t;
      adjustments.push(`+$${t.toFixed(2)} Half-Day Skill Institutes (${halfSkills} × $25)`);
    }
    if (fullSkills > 0) {
      const t = fullSkills * 65;
      price += t;
      adjustments.push(`+$${t.toFixed(2)} Full-Day Skill Institutes (${fullSkills} × $65)`);
    }
    if (groupCeus > 0) {
      const t = groupCeus * 50;
      price += t;
      adjustments.push(`+$${t.toFixed(2)} CEUs (${groupCeus} × $50)`);
    }
  }

  /* ── INDIVIDUAL: global only ── */
  if (!groupMode && globalSelected && !skillSelected) {
    price = 175;
    text  = "Global Gathering (Oct 7–8)";
    if (earlyBird) { price *= .9;  adjustments.push("−$17.50 (10%) Early Bird Discount"); }
    if (student)   { price -= 75;  adjustments.push("−$75 Student Discount"); }
    if (lived)     { price = 0;    adjustments = ["Lived Experience Scholarship applied"]; }
    if (ceu)       { price += 50;  adjustments.push("+$50 CEU fee"); }
  }

  /* ── INDIVIDUAL: skill only ── */
  if (!groupMode && skillSelected && !globalSelected) {
    price = instituteCount === 1 ? 50 : 90;
    text  = instituteCount === 1
      ? "Half-Day Skill Building Institute (Oct 6)"
      : "Full-Day Skill Building Institute (Oct 6)";
    if (lived) { price = 0; adjustments = ["Lived Experience Scholarship applied"]; }
    if (ceu)   { adjustments.push("CEUs included at no additional cost"); }
  }

  /* ── INDIVIDUAL: both ── */
  if (!groupMode && skillSelected && globalSelected) {
    const skillPrice = instituteCount === 1 ? 50 : 90;
    price = 175 + skillPrice;
    text  = instituteCount === 1
      ? "Half-Day Skill Institute & Global Gathering (Oct 6–8)"
      : "Full-Day Skill Institute & Global Gathering (Oct 6–8)";
    if (earlyBird) {
      price *= .9;
      adjustments.push(instituteCount === 1 ? "−$22.50 Early Bird Discount" : "−$26.50 Early Bird Discount");
    }
    price -= 25;
    adjustments.push("−$25 Bundle Discount");
    if (student) { price -= 75;  adjustments.push("−$75 Student Discount"); }
    if (lived)   { price = 0;    adjustments = ["Lived Experience Scholarship applied"]; }
    if (ceu)     { price += 50;  adjustments.push("+$50 CEU fee"); }
  }

  document.getElementById("finalPrice").textContent =
    `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  document.getElementById("priceBreakdown").textContent = text;
  notice.innerHTML = adjustments.join("<br>");

  if (groupMode && adjustments.length === 0) shell.classList.add("noAdjustments");
  else shell.classList.remove("noAdjustments");

  if (groupMode) {
    registrationLabel.textContent = "Group Registration Options";
    priceTopLabel.textContent = "Estimated Group Registration Cost";
    bundleNotice.textContent = "Groups of 10 or more receive additional discounts. Skill Institutes can be purchased for any number of group members.";
    bundleNotice.style.display = "block";
  } else {
    registrationLabel.textContent = "Individual Registration Options";
    priceTopLabel.textContent = "Estimated Individual Registration Cost";
    bundleNotice.textContent = "By participating in both the Global Gathering and a half or full day of Skill Building Institutes, participants receive a Bundle Discount.";
    bundleNotice.style.display = (skillSelected && globalSelected) ? "block" : "none";
  }
}

/* ── SKILL INSTITUTES DATA + TILES ── */
const institutes = [
  {
    time:"3:00 AM – 6:30 AM MDT",
    fullTitle:"Family Group Decision Making: Practice Skills for Social Workers and Coordinators",
    presenter:"Paul Nixon",
    desc:"A hands-on skills session for practitioners facilitating or contributing to Family Group Decision Making — from referral negotiation to collaborative agreement development.",
    takeaways:["Negotiate referrals and establish clear, meaningful bottom lines","Prepare families and amplify children's voices in the process","Manage conflict and navigate competing perspectives","Support collaborative planning, agreements, and reviews"],
    speakers:[{initials:"PN",name:"Paul Nixon",org:"Edinburgh, Scotland",title:"Independent Social Worker & International Consultant",bio:"International expert with 34+ years in child protection, Family Group Conferences, and leadership; former Chief Social Worker for the Government of New Zealand. Consults with governments, NGOs, and universities across six continents.",photo:"https://custom.cvent.com/AE944F71438646268B70FF5BF3772347/files/event/e7d15afcf2b14901ab0272ce8a401899/c85b4588d3f04f03af1ff97dcf7c5214.png"}]
  },
  {
    time:"7:00 AM – 10:30 AM MDT",
    fullTitle:"Amplifying Unheard Voices: Practical Skills for Power-Sharing and Lived Expertise in Child Welfare",
    presenter:"Sharon Inglis · Circles",
    desc:"Develop practical facilitation skills for power-sharing and lived expertise in child welfare. Practice facilitation moves that shift from professional discourse to shared dialogue and amplify unheard voices.",
    takeaways:["Use facilitation moves that shift toward shared dialogue","Amplify lived expertise and unheard voices in decision-making","Prepare families for leadership, participation, and safety","Practice respectful challenge while maintaining relationship and dignity"],
    speakers:[{initials:"SI",name:"Sharon Inglis",org:"Circles Training & Consultancy",title:"Director",bio:"25+ years specializing in family group conferences and restorative approaches. Supports children's services in making the shift from procedural practice to true partnership.",photo:"https://custom.cvent.com/AE944F71438646268B70FF5BF3772347/files/event/e7d15afcf2b14901ab0272ce8a401899/fb537cda9e16421abe5e3946c5057638.jpg"}]
  },
  {
    time:"7:00 AM – 10:30 AM MDT",
    fullTitle:"The Space Between Intention and Impact: A Professional Dangerousness Training",
    presenter:"Jessica Hoeper, MSW, LISW, IMH-E® & Brëanna McMullen, IMH-E®",
    desc:"Explore how well-meaning practice can become dangerous — and build a grounded, personal framework for recognizing and interrupting professional dangerousness across individual, team, and systemic levels.",
    takeaways:["Define professional dangerousness with real-world examples","Recognize PD across individual, team, and systemic levels","Apply the Self+ framework: Awareness, Reflection, Compassion, Care, Growth","Identify concrete next steps for practice and organizations"],
    speakers:[{initials:"JH",name:"Jessica Hoeper, MSW, LISW, IMH-E®",org:"Ray of HOPE, LLC",title:"Consultant | Reflective Practice Coach | Trainer",bio:"Co-founder of the PD Collective, bringing lived experience and reflective consultation to training on Professional Dangerousness. Creates honest, actionable learning spaces rooted in human services practice.",photo:"https://custom.cvent.com/AE944F71438646268B70FF5BF3772347/files/event/e7d15afcf2b14901ab0272ce8a401899/5accc76ba6ec49db8182e06fc9c81347.png"},{initials:"BM",name:"Brëanna McMullen, IMH-E®",org:"McMullen Consulting, LLC",title:"Speaker | Trainer | Reflective Coach & Consultant",bio:"Co-founder of the PD Collective alongside Jessica Hoeper, guiding communities in recognizing and transforming Professional Dangerousness through humor, compassion, and sustainable change.",photo:"https://custom.cvent.com/AE944F71438646268B70FF5BF3772347/files/event/e7d15afcf2b14901ab0272ce8a401899/5accc76ba6ec49db8182e06fc9c81347.png"}]
  },
  {
    time:"9:00 AM – 12:30 PM MDT",
    fullTitle:"From Engagement to Power: Practicing Ethical, Lived-Experience-Led Change",
    presenter:"Valerie Frost",
    desc:"Move beyond consultation toward co-creation. Examine how well-intentioned engagement can unintentionally replicate harm — and redesign it around shared authority, informed consent, and lived-experience leadership.",
    takeaways:["Identify where engagement practices recreate harmful system dynamics","Practice ethical engagement through guided simulations","Move from consultation toward authentic co-creation","Build an action plan for lived-experience-led systems change"],
    speakers:[{initials:"VF",name:"Valerie Frost, MAEd",org:"",title:"Speaker, Trainer & Advocate",bio:"Dynamic trainer and advocate with firsthand experience navigating child welfare as a parent and a decade in early childhood education. Believes gaps in well-being are opportunities for support — not risks.",photo:"https://custom.cvent.com/AE944F71438646268B70FF5BF3772347/files/event/e7d15afcf2b14901ab0272ce8a401899/606d3b0edcdc4e16a02afda9d4ea3e23.jpg"}]
  },
  {
    time:"9:00 AM – 12:30 PM MDT",
    fullTitle:"The Weight of the Gold Standard: Navigating the Intricacies of Kinship Care with Relational Intelligence",
    presenter:"Michelle Mares, PCC, CPCC",
    desc:"Kinship care is not automatically a remedy. Navigate its hidden complexities — loyalty conflicts, attachment patterns, and relational strain — with relational intelligence and trauma-informed practice.",
    takeaways:["Identify hidden pitfalls and misconceptions about kinship care","Navigate competing loyalties, grief, and attachment patterns","Apply relational intelligence when engaging caregivers and families","Create an individualized action plan for stronger relational practice"],
    speakers:[{initials:"MM",name:"Michelle Mares, PCC, CPCC",org:"Kempe Center / CRR Global",title:"Faculty, Kempe Center (CU Anschutz) · International Systems Coach",bio:"28+ years at the intersection of neurobiology and organizational health; leads Colorado's statewide Foster, Kin, and Adoptive Parent Training. A former foster parent and trained TBRI Practitioner.",photo:"https://custom.cvent.com/AE944F71438646268B70FF5BF3772347/files/event/e7d15afcf2b14901ab0272ce8a401899/a3e21ea156c249bbbb07aab7866420c5.jpg"}]
  },
  {
    time:"9:00 AM – 12:30 PM MDT",
    fullTitle:"Curiosity Is Key: Leading Change in a Compliance Driven Culture",
    presenter:"Mark Durgin, Barb Putnam & Ellen Kagen · Kagen Leadership Group",
    desc:"An immersive, practice-based introduction to the Coach Approach to Adaptive Leadership — building the skills, mindset, and relational practices that drive real system change in compliance-heavy environments.",
    takeaways:["Practice asking better questions and staying curious before moving to solution","Apply the Coach Approach to an adaptive challenge in your own system","Use values-based decision-making and adaptive challenge identification","Identify one adaptive challenge and commit to doing something differently starting Monday"],
    speakers:[{initials:"MD",name:"Mark Durgin",org:"Kagen Leadership Group",title:"National Coordinator",bio:"20+ years transforming organizations through adaptive leadership coaching, including a $23M behavioral health systems initiative. Has guided 2,500+ professionals in cross-sector communication and systemic problem-solving.",photo:"https://custom.cvent.com/AE944F71438646268B70FF5BF3772347/files/event/e7d15afcf2b14901ab0272ce8a401899/1911c1220e974a53a533087beb213e95.png"},{initials:"BP",name:"Barb Putnam",org:"Kagen Leadership Group",title:"Associate · BASW, MSW, LICSW, CMHS",bio:"Leader in Washington State's System of Care since 1987, spanning community mental health and statewide children's services. Certified Coach Approach for Adaptive Leadership trainer.",photo:"https://custom.cvent.com/AE944F71438646268B70FF5BF3772347/files/event/e7d15afcf2b14901ab0272ce8a401899/92a9464813d54b3189fc61fa94b2ff0e.jpg"},{initials:"EK",name:"Ellen Kagen, MSW, PCC",org:"Kagen Leadership Group / Georgetown University",title:"Assistant Professor; Founder, Georgetown Leadership Academy",bio:"Creator of the Transformation Facilitation coaching model with curriculum adapted across 30+ states covering Adaptive Leadership, Cultural Competence, and Systems Change.",photo:"https://custom.cvent.com/AE944F71438646268B70FF5BF3772347/files/event/e7d15afcf2b14901ab0272ce8a401899/a9768e31b09a4054839a72b5dbce699d.png"}]
  },
  {
    time:"11:00 AM – 2:30 PM MDT",
    fullTitle:"Working Relationally: Strengthening Families, Networks, and Hope",
    presenter:"Dan Martin · Daniel Martin Consulting",
    desc:"Move beyond transactions to build relationships that last. Strengthen family and community networks, restore hope, and create meaningful change through deeply relational practice.",
    takeaways:["Strengthen family and community networks","Use relational tools for authentic engagement","Reconnect and rebuild disconnected family systems","Apply hope-centered, practical frameworks in daily work"],
    speakers:[{initials:"DM",name:"Dan Martin",org:"Daniel Martin Consulting",title:"Director",bio:"Developer of the HEERO Model for resilience, belonging, and healing, with 30+ years in child welfare, mental health, and addictions across four Canadian agencies. Trains practitioners across North America and internationally.",photo:"https://custom.cvent.com/AE944F71438646268B70FF5BF3772347/files/event/e7d15afcf2b14901ab0272ce8a401899/20efd7dd23744a78b7eeb2f76056a761.png"}]
  },
  {
    time:"11:00 AM – 2:30 PM MDT",
    fullTitle:"Train Your Brain for Better Work: Practical Mindfulness That Sticks",
    presenter:"Stacey Moss, Tracy Malone & Jude Louissaint · Public Knowledge",
    desc:"Organizational mindfulness as a performance tool, not a wellness trend. Build practical skills to manage stress, improve focus, and strengthen interpersonal effectiveness. Designed for leaders, managers, and supervisors.",
    takeaways:["Interrupt automatic reactions and return to conscious awareness","Shift attention to the present moment under pressure","Decenter from reactive thoughts without suppressing them","Build a daily informal mindfulness practice for the workplace"],
    speakers:[{initials:"SM",name:"Stacey Moss, JD, CWLS, PMP®",org:"Public Knowledge®",title:"President & CEO",bio:"25+ years across government, legal, and nonprofit sectors; Child Welfare Law Specialist leading system transformation nationwide. Leads the Public Knowledge IMPACT Leadership Program.",photo:"https://custom.cvent.com/AE944F71438646268B70FF5BF3772347/files/event/e7d15afcf2b14901ab0272ce8a401899/a0b234bb70834f66aedb516198806f4b.jpg"},{initials:"TM",name:"Tracy Malone",org:"Public Knowledge®",title:"Senior Consultant · MSW, Prosci® Certified",bio:"28 years in public child welfare from frontline worker to statewide director, specializing in child welfare reform and continuous quality improvement.",photo:"https://custom.cvent.com/AE944F71438646268B70FF5BF3772347/files/event/e7d15afcf2b14901ab0272ce8a401899/1674b55b6c684eda8785ab18030738e1.jpg"},{initials:"JL",name:"Jude Louissaint",org:"Public Knowledge®",title:"Management Consultant · MSW, ICF Certified Master Coach",bio:"30+ years across local, state, and federal child welfare, including Director of Field Operations at NYC's Administration for Children's Services. Specializes in leadership development and systems change.",photo:"https://custom.cvent.com/AE944F71438646268B70FF5BF3772347/files/event/e7d15afcf2b14901ab0272ce8a401899/08aa9a7aa0094bfeb36a4a41be2f5617.jpg"}]
  },
  {
    time:"1:00 PM – 4:30 PM MDT",
    fullTitle:"Relational Family Finding, Network-Building, and Conflict Facilitation",
    presenter:"Elizabeth Wendel, MSW, LSW · Pale Blue",
    desc:"Go beyond database searches to find and engage the people around families — relationally. Practice building networks, navigating personal bias, and welcoming constructive conflict in family meetings.",
    takeaways:["Use relational search strategies beyond database lookups","Build intentional networks around birth parents, youth, and family","Reflect on personal bias and discomfort in relational engagement","Facilitate family meetings through — not around — constructive conflict"],
    speakers:[{initials:"EW",name:"Elizabeth Wendel, MSW, LSW",org:"Pale Blue",title:"Co-Founder & President",bio:"Co-author of Family Finding® and Family Seeing®; her team linked 10,000+ young people to 26,000+ lasting supports. Teaches one truth: connection is the most powerful intervention we have.",photo:"https://custom.cvent.com/AE944F71438646268B70FF5BF3772347/files/event/e7d15afcf2b14901ab0272ce8a401899/8000a49cebfc454c9fb103b9d946b2c9.jpg"}]
  },
  {
    time:"1:00 PM – 4:30 PM MDT",
    fullTitle:"Strengthening Families: Turning Protective Factors into Action",
    presenter:"Colleen Gibley-Reed · Strengthening Families",
    desc:"Build family strengths from the inside out. Explore the five Protective Factors framework and translate research-backed principles into practical, everyday interventions.",
    takeaways:["Apply protective factors in direct practice","Use strengths-based assessment and engagement tools","Shift from problem-focus to family resilience","Co-create individualized action plans with families"],
    speakers:[{initials:"CG",name:"Colleen Gibley-Reed",org:"Illuminate Colorado",title:"Director of Education",bio:"Former Kempe Center Faculty Instructor with 19 years in Larimer County child welfare. Leads education programming at Illuminate Colorado, equipping practitioners to help families thrive.",photo:"https://custom.cvent.com/AE944F71438646268B70FF5BF3772347/files/event/e7d15afcf2b14901ab0272ce8a401899/f44828c03f9949b4b8725f7f99745154.jpg"}]
  },
  {
    time:"7:00 PM – 10:30 PM MDT",
    fullTitle:"Belonging-focused Foster Care",
    presenter:"Andrew Turnell & Anna Stromberg · Born to Belong",
    desc:"A practical, belonging-focused vision for transforming foster care by bringing carers, parents, and extended family together to work collaboratively — grounded in real case examples where fostering has been a true collaboration.",
    takeaways:["Explore a detailed vision of belonging-focused collaborative foster care","Practice foster care recruitment and support that enables carer-family partnership","Develop carer and family collaboration practices through case-based exercises","Envision revised family time and initial placement activities that prioritize connection"],
    speakers:[{initials:"AT",name:"Andrew Turnell, AM",org:"Born to Belong",title:"Director · Social Work Professor of Practice, Univ. of Cumbria",bio:"Principal co-creator of Signs of Safety; internationally renowned for applying safety-organised practice to statutory child protection. Currently works with agencies across England, Europe, Canada, and beyond.",photo:"https://custom.cvent.com/AE944F71438646268B70FF5BF3772347/files/event/e7d15afcf2b14901ab0272ce8a401899/7464efdc944f405c86ac7cab697ff19c.png"},{initials:"AS",name:"Anna Stromberg",org:"Södertalje Children's Services",title:"Foster Carer & Social Worker",bio:"Social worker with extensive experience in children's services including six years in Myanmar. Has been a committed foster carer in Sweden for 15 years, partnering with parents in every placement."}]
  }
];

const siGrid   = document.getElementById("siGrid");
const siDetail = document.getElementById("siDetail");

institutes.forEach((inst, i) => {
  const tile = document.createElement("div");
  tile.className = "siTile";
  tile.dataset.index = i;
  tile.innerHTML = `<div class="siTileTime">${inst.time}</div><div class="siTileTitle">${inst.fullTitle}</div><div class="siTilePresenter">${inst.presenter}</div>`;
  tile.addEventListener("click", () => openInstitute(i, tile));
  siGrid.appendChild(tile);
});

function openInstitute(i, tile) {
  const active = siGrid.querySelector(".siTile.active");
  if (active === tile) {
    tile.classList.remove("active");
    siDetail.classList.remove("visible");
    return;
  }
  siGrid.querySelectorAll(".siTile").forEach(t => t.classList.remove("active"));
  tile.classList.add("active");
  const inst = institutes[i];
  const speakerHTML = inst.speakers.map(s => `
    <div class="siSpeaker">
      <img class="siSpeakerImg" src="${s.photo || 'https://placehold.co/64x64/bebe7b/122345?text=' + s.initials}" alt="${s.name}">
      <div><div class="siSpeakerName">${s.name}</div>${s.org ? `<div class="siSpeakerOrg">${s.org}</div>` : ''}</div>
      ${(s.title || s.org || s.bio) ? `<div class="siSpeakerTooltip">${s.title ? `<div class="siSpeakerTooltipTitle">${s.title}</div>` : ''}${s.org ? `<div class="siSpeakerTooltipOrg">${s.org}</div>` : ''}${s.bio ? `<div class="siSpeakerTooltipBio">${s.bio}</div>` : ''}</div>` : ''}
    </div>`).join('');
  const takeawayHTML = inst.takeaways.map(t => `<li>${t}</li>`).join('');
  siDetail.innerHTML = `
    <div class="siDetailTop">
      <div>
        <div class="siDetailTime">Tue Oct 6 · ${inst.time} MDT</div>
        <div class="siDetailTitle">${inst.fullTitle}</div>
      </div>
      <button class="siDetailClose" id="siDetailClose">✕</button>
    </div>
    <div class="siDetailDesc">${inst.desc}</div>
    <div class="siDetailCols">
      <ul class="siTakeaways">${takeawayHTML}</ul>
      <div class="siSpeakers">${speakerHTML}</div>
    </div>`;
  siDetail.classList.remove("visible");
  void siDetail.offsetWidth; // force reflow for animation replay
  siDetail.classList.add("visible");
  document.getElementById("siDetailClose").addEventListener("click", () => {
    tile.classList.remove("active");
    siDetail.classList.remove("visible");
  });
}

/* ── INIT ── */
updatePrice();
document.getElementById("skillCountSection").style.display = "none";

/* ── IFRAME HEIGHT ── */
function emitHeight() {
  const height = document.getElementById("ggWidgetShell").scrollHeight + 32;
  window.parent.postMessage({ ggWidgetHeight: height }, "*");
}
new ResizeObserver(emitHeight).observe(document.getElementById("ggWidgetShell"));
emitHeight();
