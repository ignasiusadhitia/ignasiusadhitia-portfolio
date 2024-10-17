const projectsWrapper = document.getElementById("projects-wrapper");
const testimonialsWrapper = document.getElementById("testimonials-wrapper");

function displayItems(data) {
  // Display Projects
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
          ${project.desc.substring(0, 90)}...
        </p>
        <div class="project-card-footer">
          <a href="${project.demoUrl}">Demo</a>
          <a href="${project.githubUrl}">Github</a>
        </div>
    </div>`;

    projectsWrapper.appendChild(projectCard);
  });

  // Display Testimonials
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
