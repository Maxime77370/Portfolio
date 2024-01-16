document.addEventListener("DOMContentLoaded", async function() {
    const imgResize = new ImgResizebyTxt();
    const caravel = new Caravel();

    // event resize
    window.addEventListener("resize", function() {
        imgResize.resizeImages();
        caravel.updateBodyWidth();
    });

    function animate() {
        caravel.work();
        requestAnimationFrame(animate);
    }

    animate();
});

class ImgResizebyTxt {
    constructor() {
        this.img = document.querySelectorAll('.img-resize');
        this.txt = document.querySelectorAll('.txt-resize');
        this.resizeImages();
    }

    resizeImages() {
        for (let i = 0; i < this.img.length; i++) {
            const txtHeight = this.txt[i].offsetHeight;
            this.img[i].style.width = txtHeight + 'px';
            this.img[i].style.height = txtHeight + 'px';
            this.img[i].style.display = 'block';
        }
    }
}



/**
 * Represents a Caravel object.
 * @class
 */
class Caravel {

    /**
     * Represents a Caravel object.
     * @constructor
     */
    
    constructor() {
        this.allCaravel = document.querySelectorAll('.caravel');
        this.parent = document.querySelector('.caravel-parent');
        this.btnLeft = document.querySelector('.caravel-btn-left');
        this.btnRight = document.querySelector('.caravel-btn-right');
        this.body = document.body;

        this.initializeCaravels();

        this.n = 0;
        this.boost_max = 0;
        this.boost = 0;
        this.boost_pos_start = 0;
        this.boost_switch = false;
        this.speed = 2;
        this.distanceBetweenCaravel = parseInt(this.allCaravel[1].style.left.replace('px','')) - parseInt(this.allCaravel[0].style.left.replace('px',''));

        this.btnLeft.addEventListener('click', () => {
            this.boost_max = 30;
            this.boost_switch = true;
        });
        this.btnRight.addEventListener('click', () => {
            this.boost_max = -30;
            this.boost_switch = true;
        });
    }


    /**
     * Initializes the caravels' styles and positions.
     */
    initializeCaravels() {

        // Set height for the parent element
        this.offset = this.allCaravel[0].offsetWidth * 0.3;
        this.nb_caravel = this.allCaravel.length;

        // Set styles and positions for each caravel
        for (let i = 0; i < this.allCaravel.length; i++) {
            this.allCaravel[i].style.position = 'absolute';
            this.allCaravel[i].style.left = i === 0 ? '0px' : `${parseInt(this.allCaravel[i].style.width.replace('px', '')) * i + (this.offset * i)}px`;
            this.allCaravel[i].style.height = this.allCaravel[0].offsetHeight + 'px';
            this.allCaravel[i].style.transition = "filter 0.3s ease, opacity 0.3s ease";
        }

        // Set left position for the left button and right position for the right button
        this.btnLeft.style.left = this.allCaravel[0].offsetWidth * 0.3 + 'px';
        this.btnRight.style.right = this.allCaravel[0].offsetWidth * 0.3 + 'px';

        // Set top position for both buttons relative to the first caravel
        var rect = this.allCaravel[0].getBoundingClientRect();
        var rectTop = rect.top + window.scrollY;
        this.btnLeft.style.top = this.allCaravel[0].offsetHeight / 2 + rectTop + 'px';
        this.btnRight.style.top = this.allCaravel[0].offsetHeight / 2 + rectTop + 'px';

        this.pos_max = this.allCaravel[0].offsetWidth * (this.nb_caravel-1) + this.offset * this.nb_caravel;
        this.parent.style.height = this.allCaravel[0].offsetHeight + 30 + 'px';
    }


    updateBodyWidth() {
        this.initializeCaravels();
    }

    /**
     * Calculates the boost effect based on button clicks and updates the boost properties.
     */
    boost_calc() {
        // Check if boost is activated
        if (this.boost_switch) {
            // Boost to the right
            if (this.boost_max > 0) {
                // Ensure speed is positive for rightward boost
                if (this.speed < 0) {
                    this.speed = -this.speed;
                }

                // Calculate distance between the current position and the boost start position
                var distanceBetween = parseInt(this.allCaravel[0].style.left.replace('px', '')) - this.pos_start + this.speed;

                // Handle wrap-around effect if the caravel exceeds the maximum position
                if (distanceBetween < 0) {
                    distanceBetween = parseInt(this.allCaravel[0].style.left.replace('px', '')) - this.pos_start + this.pos_max + parseInt(this.allCaravel[0].style.width.replace("px", ""));
                }

                // Normalize the distance between 0 and 1
                let normalized = distanceBetween / this.distanceBetweenCaravel;

                // Calculate boost using a quadratic easing function
                this.boost = (1 - (normalized - 0.5) ** 2 * 4) * this.boost_max;

                // Disable boost if the caravel reaches or exceeds its original position
                if (this.distanceBetweenCaravel < distanceBetween) {
                    this.boost_switch = false;
                }
            }
            // Boost to the left
            else {
                // Ensure speed is negative for leftward boost
                if (this.speed > 0) {
                    this.speed = -this.speed;
                }

                // Calculate distance between the boost start position and the current position
                var distanceBetween = this.pos_start - parseInt(this.allCaravel[0].style.left.replace('px', '')) - this.speed;

                // Handle wrap-around effect if the caravel exceeds the maximum position
                if (distanceBetween < 0) {
                    distanceBetween = parseInt(this.allCaravel[0].style.width.replace("px", "")) + this.pos_start + this.pos_max - parseInt(this.allCaravel[0].style.left.replace('px', ''));
                }

                // Normalize the distance between 0 and 1
                let normalized = distanceBetween / this.distanceBetweenCaravel;

                // Calculate boost using a quadratic easing function
                this.boost = (1 - (normalized - 0.5) ** 2 * 4) * this.boost_max;

                // Disable boost if the caravel reaches or exceeds its original position
                if (this.distanceBetweenCaravel < distanceBetween) {
                    this.boost_switch = false;
                }
            }
        }
        // Reset boost properties if boost is not activated
        else {
            this.pos_start = parseInt(this.allCaravel[0].style.left.replace('px', ''));
            this.boost = 0;
        }
    }

    /**
     * Performs the main animation and visual effects on caravels based on their positions.
     */
    work() {
        // Calculate boost effect
        this.boost_calc();

        // Iterate through caravels
        for (let i = 0; i < this.allCaravel.length; i++) {
            // Get current left position
            var currentLeft = parseFloat(this.allCaravel[i].style.left.replace('px', ''));

            // Update caravel position considering speed and boost
            this.allCaravel[i].style.left = (currentLeft + this.speed + this.boost) + 'px';

            // Check if caravel is out of view on the right
            if (currentLeft > this.body.offsetWidth && currentLeft > 0) {
                this.allCaravel[i].style.display = 'none';
            } else {
                this.allCaravel[i].style.display = 'block';
            }

            // Handle caravel wrap-around on the right
            if (currentLeft > this.pos_max && this.speed > 0) {
                this.allCaravel[i].style.left = currentLeft - this.pos_max - parseInt(this.allCaravel[i].style.width.replace("px", "")) + 'px';
            }
            // Handle caravel wrap-around on the left
            else if (currentLeft + parseInt(this.allCaravel[0].style.width.replace('px', '')) < 0 && this.speed < 0) {
                this.allCaravel[i].style.left = currentLeft + this.pos_max + parseInt(this.allCaravel[i].style.width.replace("px", "")) + 'px';
            }

            // Get updated bounding box
            var boundingBox = this.allCaravel[i].getBoundingClientRect();
            currentLeft = boundingBox.left;
            var elementWidth = this.allCaravel[i].offsetWidth;

            // Apply blur and opacity effects periodically
            if (this.n % 10 == 0) {
                if (currentLeft + elementWidth < window.innerWidth / 4) {
                    // Caravel is in the first zone, apply decreasing blur
                    let normalizedDistance = (window.innerWidth / 4 - (currentLeft + elementWidth)) / (window.innerWidth / 4);
                    let blurIntensity = normalizedDistance * 5;

                    this.allCaravel[i].style.filter = "blur(" + blurIntensity + "px)";
                    this.allCaravel[i].style.opacity = 1 - normalizedDistance;

                } else if (currentLeft > window.innerWidth / 4 * 3) {
                    // Caravel is in the last zone, apply increasing blur
                    let normalizedDistance = ((currentLeft) - window.innerWidth / 4 * 3) / (window.innerWidth / 4);
                    let blurIntensity = normalizedDistance * 5;

                    this.allCaravel[i].style.filter = "blur(" + blurIntensity + "px)";
                    this.allCaravel[i].style.opacity = 1 - normalizedDistance;
                } else {
                    // Caravel is in the central zone, no blur
                    this.allCaravel[i].style.filter = "blur(0px)";
                    this.allCaravel[i].style.opacity = 1;
                }
            }
        }

        // Increment iteration counter
        this.n++;
    }
}
        

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
