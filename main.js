// Loading Screen
const loadingScreen = document.getElementById("loading-screen");
const mainContent = document.getElementById("main-content");

window.addEventListener("load", () => {
  setTimeout(() => {
    loadingScreen.style.display = "none";
    mainContent.style.display = "block";
  }, 2000);
});

// Display Current Year
const yearText = document.getElementById("year");
const date = new Date();
let year = date.getFullYear();
yearText.innerText = year;

// Display Projects and Testimonial Cards
const projectsWrapper = document.getElementById("projects-wrapper");
const testimonialsWrapper = document.getElementById("testimonials-wrapper");

function displayItems(data) {
  // Projects
  data.projects.map((project) => {
    const projectCard = document.createElement("div");
    projectCard.classList.add("project-card");

    projectCard.innerHTML = `
    <div class="project-card-header">
        <img
          src="${project.img}"
          alt="${project.title}"
          class="project-card-image"
        />
    </div>

    <div class="project-card-body">
        <h4>${project.title}</h4>
        <p>
          ${project.desc.substring(0, 84)}...
          <a href="${project.demoUrl}">Read More</a>          
        </p>
        <div class="project-card-footer">
          <a href="${project.demoUrl}">Demo</a>
          <a href="${project.githubUrl}">Github</a>
        </div>
    </div>`;

    projectsWrapper.appendChild(projectCard);
  });

  // Testimonials
  data.testimonials.map((testimonial) => {
    const testimonialCard = document.createElement("div");
    testimonialCard.classList.add("testimonial-card");

    testimonialCard.innerHTML = `    
    <div class="testimonial-card-header">
      <img
        src="${testimonial.img}"
        alt="${testimonial.name}"
        class="testimonial-card-header-img"
      />
      <div class="testimonial-card-header-info">
        <h4>${testimonial.name}</h4>
        <small>${testimonial.title}</small>
      </div>
    </div>
    <p>
      <em>
        "${testimonial.desc}"
      </em>
    </p>
`;

    testimonialsWrapper.appendChild(testimonialCard);
  });
}

fetch("data.json")
  .then((response) => response.json())
  .then((data) => displayItems(data));

// Toast
function showToast(message, type) {
  const toast = document.createElement("div");
  toast.classList.add("toast");

  // Add success or error type based on the input
  if (type === "success") {
    toast.classList.add("toast-success");
  } else {
    toast.classList.add("toast-error");
  }

  toast.textContent = message;

  document.getElementById("toast-container").appendChild(toast);

  // Remove the toast after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Send Email
const form = document.getElementById("contact-form");
const url = "https://lumoshive-academy-email-api.vercel.app/send-email";
const key = "RJS1-202410";

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  const submitButton = document.getElementById("submit-button");
  submitButton.disabled = true;

  const formData = {
    to: "ignasius.yuda.adhitia@gmail.com",
  };

  let isValid = true; // Flag to track validation status

  // Clear previous error messages
  const errorElements = form.querySelectorAll(".error-message");
  errorElements.forEach((errorElement) => {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  });

  // Loop through the form elements and extract their values
  for (let i = 0; i < form.elements.length; i++) {
    let element = form.elements[i];
    const errorElement = document.getElementById(`${element.name}-error`);
    if (element.name && element.name !== "to") {
      if (element.value.trim() === "") {
        // Check if the field is empty
        isValid = false;
        if (element.name === "text") {
          errorElement.textContent = "Message is required!";
        } else {
          errorElement.textContent = `${
            // Capitalize the first letter of the field name
            element.name.charAt(0).toUpperCase() + element.name.slice(1)
          } is required!`;
        }

        errorElement.style.display = "block";
        element.classList.add("error");
      } else {
        formData[element.name] = element.value;
        element.classList.remove("error");
      }
    }
  }

  // If any field is invalid, prevent form submission
  if (!isValid) {
    submitButton.disabled = false;
    return;
  }

  fetch(url, {
    method: "POST",
    headers: {
      "x-api-key": key,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        // Handle non-200 responses
        return response.json().then((data) => {
          let errorMessage = data.message || "An error occurred";

          // Handle specific status codes
          if (response.status === 401) {
            errorMessage = "Unauthorized access, invalid API key";
          }

          showToast(errorMessage, "error"); // Show error toast once
          throw new Error(errorMessage); // Stop further execution
        });
      }
      return response.json(); // If successful, parse JSON
    })
    .then((data) => {
      showToast(data.message, "success"); // Show success toast
      form.reset(); // Clear form fields

      // Remove error classes on input fields
      form.querySelectorAll(".error").forEach((element) => {
        element.classList.remove("error");
      });
      submitButton.disabled = false; // Re-enable the submit button
    })
    .catch((error) => {
      // Catch block handles fetch errors or network issues
      if (error.message !== "Unauthorized access, invalid API key") {
        showToast(error.message || "Network error, please try again", "error"); // Show error toast once
      }
      submitButton.disabled = false; // Re-enable the submit button
    });
});
