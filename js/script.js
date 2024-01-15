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

class Caravel {
    constructor() {
        this.allCaravel = document.querySelectorAll('.caravel');
        this.parent = document.querySelector('.caravel-parent');
        this.btnLeft = document.querySelector('.caravel-btn-left');
        this.btnRight = document.querySelector('.caravel-btn-right');
        this.body = document.body;
        this.offset = this.allCaravel[0].offsetWidth * 0.3;

        this.parent.style.height = this.allCaravel[0].offsetHeight + 30 + 'px';

        this.nb_caravel = this.allCaravel.length;

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

    initializeCaravels() {
        for (let i = 0; i < this.allCaravel.length; i++) {
            this.allCaravel[i].style.position = 'absolute';
            this.allCaravel[i].style.left = i === 0 ? '0px' : `${(this.body.offsetWidth * i / this.allCaravel.length) + (this.offset * i)}px`;
            this.allCaravel[i].style.height = this.allCaravel[0].offsetHeight + 'px';
            this.allCaravel[i].style.transition = "filter 0.3s ease, opacity 0.3s ease";;
        }

        this.btnLeft.style.left = this.allCaravel[0].offsetWidth * 0.3 + 'px';
        this.btnRight.style.right = this.allCaravel[0].offsetWidth * 0.3 + 'px';
        
        var rect = this.allCaravel[0].getBoundingClientRect();
        var rectTop = rect.top;
        this.btnLeft.style.top = this.allCaravel[0].offsetHeight / 2 + rectTop + 'px';
        this.btnRight.style.top = this.allCaravel[0].offsetHeight / 2 + rectTop + 'px';
    }

    updateBodyWidth() {
        this.body.style.width = window.innerWidth + 'px';
        this.boost_pos_start = parseInt(this.allCaravel[0].style.left.replace('px',''));
    }

    boost_calc() {
        

        if (this.boost_switch) {
            if (this.boost_max > 0) {   

                if(this.speed < 0) {
                    this.speed = -this.speed;
                }

                var distanceBetween = parseInt(this.allCaravel[0].style.left.replace('px',''))  - this.pos_start + this.speed;
                if (distanceBetween < 0) {
                    distanceBetween = parseInt(this.allCaravel[0].style.left.replace('px','')) - this.pos_start + this.body.offsetWidth + parseInt(this.allCaravel[0].style.width.replace("px",""));
                }
                let normalized = distanceBetween / this.distanceBetweenCaravel;
                this.boost = (1 - (normalized-0.5)**2 * 4)* this.boost_max;
                if (this.distanceBetweenCaravel < distanceBetween) {
                    this.boost_switch = false;
                }
            }
            else {

                if(this.speed > 0) {
                    this.speed = -this.speed;
                }

                var distanceBetween = this.pos_start - parseInt(this.allCaravel[0].style.left.replace('px','')) - this.speed;
                if (distanceBetween < 0) {
                    distanceBetween = parseInt(this.allCaravel[0].style.width.replace("px","")) + this.pos_start + this.body.offsetWidth - parseInt(this.allCaravel[0].style.left.replace('px',''));
                }
                let normalized = distanceBetween / this.distanceBetweenCaravel;
                this.boost = (1 - (normalized-0.5)**2 * 4)* this.boost_max;
                if (this.distanceBetweenCaravel < distanceBetween) {
                    this.boost_switch = false;
                }
            }

        }
        else {
            this.pos_start = parseInt(this.allCaravel[0].style.left.replace('px',''));
            this.boost = 0;
        }
    }

    
    work() {

        this.boost_calc(this);


        for (let i = 0; i < this.allCaravel.length; i++) {
            var currentLeft = parseFloat(this.allCaravel[i].style.left.replace('px', ''));

            this.allCaravel[i].style.left = (currentLeft + this.speed + this.boost) + 'px';

            if (currentLeft > this.body.offsetWidth && this.speed > 0) {
                this.allCaravel[i].style.left = currentLeft - this.body.offsetWidth - parseInt(this.allCaravel[i].style.width.replace("px","")) + 'px';
            }
            else if (currentLeft + parseInt(this.allCaravel[0].style.width.replace('px','')) < 0 && this.speed < 0) {
                this.allCaravel[i].style.left = currentLeft + this.body.offsetWidth + parseInt(this.allCaravel[i].style.width.replace("px","")) + 'px';
            }
            var boundingBox = this.allCaravel[i].getBoundingClientRect();
            currentLeft = boundingBox.left;
            var elementWidth = this.allCaravel[i].offsetWidth; // Largeur de l'élément

            if (this.n%10==0){
                if (currentLeft + elementWidth < window.innerWidth / 4) {
                    // L'élément est dans la première zone, appliquer le flou décroissant
                    let normalizedDistance = (window.innerWidth / 4 - (currentLeft + elementWidth)) / (window.innerWidth / 4);
                    let blurIntensity = (normalizedDistance) * 5;

                    this.allCaravel[i].style.filter = "blur(" + blurIntensity + "px)";
                    this.allCaravel[i].style.opacity = 1 - normalizedDistance;

                } else if (currentLeft > window.innerWidth / 4 * 3) {
                    // L'élément est dans la dernière zone, appliquer le flou croissant
                    let normalizedDistance = ((currentLeft) - window.innerWidth / 4 * 3) / (window.innerWidth / 4);
                    let blurIntensity = normalizedDistance * 5;

                    this.allCaravel[i].style.filter = "blur(" + blurIntensity + "px)";
                    this.allCaravel[i].style.opacity = 1 - normalizedDistance;
                } else {
                    // L'élément est dans la zone centrale, pas de flou
                    this.allCaravel[i].style.filter = "blur(0px)";
                    this.allCaravel[i].style.opacity = 1;
                }
            }
        }
        this.n++;
    }
}
        

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
