/**
 * NutriScan AI - Utility Helpers & UI Notifications
 */

export class Helpers {
  /**
   * Show toast notification
   */
  static showToast(message, type = "info", duration = 3000) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-pill toast-${type} animate-slide-up`;
    
    let icon = "✨";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "⚠️";
    if (type === "fire") icon = "🔥";
    if (type === "water") icon = "💧";

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-fade-out");
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  /**
   * Compress image before AI processing to maximize speed & minimize memory
   */
  static compressImage(file, maxWidth = 1000, maxHeight = 1000, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  }

  /**
   * Format currency
   */
  static formatCurrency(amount) {
    return `₹${Math.round(amount || 0)}`;
  }

  /**
   * Format macros
   */
  static formatGrams(g) {
    return `${Math.round(g || 0)}g`;
  }

  /**
   * Start live webcam or phone camera video stream
   */
  static async startCameraStream(videoElement, facingMode = "environment") {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Live camera is not supported on this browser/device.");
    }

    const constraints = {
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = stream;
    await videoElement.play();
    return stream;
  }

  /**
   * Capture single frame from live video element to JPEG base64
   */
  static captureVideoFrame(videoElement, quality = 0.85) {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth || 640;
    canvas.height = videoElement.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", quality);
  }

  /**
   * Stop active camera stream tracks cleanly
   */
  static stopCameraStream(stream) {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }

  /**
   * Canvas Confetti Celebration Particle Effect (Zero external dependencies)
   */
  static triggerConfetti() {
    let canvas = document.getElementById("confetti-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "confetti-canvas";
      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "99999";
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ["#10B981", "#06B6D4", "#F59E0B", "#F43F5E", "#6366F1", "#38BDF8"];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.width * 0.5 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.4 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 1.2) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeCount = 0;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5; // gravity
        p.rotation += p.rSpeed;
        p.opacity -= 0.015;

        if (p.opacity > 0) {
          activeCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (activeCount > 0 && frame < 100) {
        frame++;
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();
  }
}
