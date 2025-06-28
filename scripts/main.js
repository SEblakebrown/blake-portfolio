// Theme toggle
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');
  });
  
    // Radar Skills Chart
    const ctx = document.getElementById('skillsChart').getContext('2d');
    new Chart(ctx, {
    type: 'radar',
    data: {
        labels: ['C++', 'Java', 'Python', 'Object-Oriented Design', 'Data Engineering', 'Algorithms'],
        datasets: [{
        label: 'Skill Level (1-10)',
        data: [8, 7, 7, 8, 6, 7],  // Balanced 6-9 range
        backgroundColor: 'rgba(243, 156, 18, 0.2)',
        borderColor: '#f39c12',
        pointBackgroundColor: '#f39c12'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scale: {
        r: {
            suggestedMin: 0,
            suggestedMax: 10,
            ticks: {
            stepSize: 1,
            color: document.body.classList.contains('dark-mode') ? '#fff' : '#000'
            },
            pointLabels: {
            color: document.body.classList.contains('dark-mode') ? '#fff' : '#000',
            font: {
                size: 14
            }
            }
        }
        }
    }
    });


  
  // Contact Form Fake Submission
  document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('form-status').textContent = '✅ Message sent! (Pretend)';
  });
  