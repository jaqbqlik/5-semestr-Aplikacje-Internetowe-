//const msg: string = "Hello!";
//alert(msg);




interface StyleConfig {
    name: string;
    filename: string;
}


const STYLES: StyleConfig[] = [
    { name: 'Styl 1 - Ciemny', filename: 'style-1' },
    { name: 'Styl 2 - Jasny', filename: 'style-2' }
];

console.debug('Załadowane style:', STYLES);


class StyleToggler {
    private styles: StyleConfig[];
    private currentIndex: number;
    private linkElements: HTMLLinkElement[];

    constructor(styles: StyleConfig[]) {
        this.styles = styles;
        this.currentIndex = 0;
        this.linkElements = [];
        this.init();
    }
    private init(): void {
        for (const style of this.styles) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `./public/${style.filename}.css`;
            link.disabled = true;
            document.head.appendChild(link);
            this.linkElements.push(link);
            console.log(`Dodano styl do DOM: ${style.name} (${style.filename}.css)`);
        }
        if (this.linkElements.length > 0) {
            this.linkElements[0].disabled = false;
            console.log('Zainicjalizowano ze stylem:', this.styles[0].name);
        }
        this.drawToggler();
    }
    public toggle(): void {
        if (this.linkElements.length === 0) return;

        this.linkElements[this.currentIndex].disabled = true;
        console.log(`Wyłączono styl: ${this.styles[this.currentIndex].name}`);

        this.currentIndex = (this.currentIndex + 1) % this.linkElements.length;

        this.linkElements[this.currentIndex].disabled = false;
        console.log(`Włączono styl: ${this.styles[this.currentIndex].name}`);
    }

    private drawToggler(): void {
        const togglerContainer = document.createElement('div');
        togglerContainer.id = 'style-toggler-container';
        togglerContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: rgba(255, 255, 255, 0.95);
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border: 1px solid #ddd;
    `;
        const title = document.createElement('div');
        title.textContent = 'Przełącznik stylów';
        title.style.cssText = `font-weight: bold; font-size: 14px; margin-bottom: 5px; color: #333;`;
        togglerContainer.appendChild(title);
        const currentStyleInfo = document.createElement('div');
        currentStyleInfo.id = 'current-style-info';
        currentStyleInfo.textContent = `Aktualny: ${this.styles[this.currentIndex].name}`;
        currentStyleInfo.style.cssText = `font-size: 12px; color: #666; margin-bottom: 10px;
        `;
        togglerContainer.appendChild(currentStyleInfo);

        this.styles.forEach((style, index) => {
            const button = document.createElement('button');
            button.textContent = style.name;
            button.style.cssText = `
                padding: 8px 15px;
                background: ${index === this.currentIndex ? '#007bff' : '#f8f9fa'};
                color: ${index === this.currentIndex ? '#fff' : '#333'};
                border: 1px solid ${index === this.currentIndex ? '#007bff' : '#ddd'};
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                transition: all 0.3s;
             `;
            button.addEventListener('click', () => {
                this.switchToStyle(index);
                this.updateTogglerButtons(togglerContainer);
            });
            button.addEventListener('mouseenter', () => {
                if (index !== this.currentIndex) {
                    button.style.background = '#e9ecef';
                }
            });
            button.addEventListener('mouseleave', () => {
                if (index !== this.currentIndex) {
                    button.style.background = '#f8f9fa';
                }
            });
            togglerContainer.appendChild(button);
        });
        document.body.appendChild(togglerContainer);
        console.log('Utworzono przełącznik stylów z przyciskami');
    }

    private switchToStyle(index: number): void {
        if (index === this.currentIndex) return;

        this.linkElements[this.currentIndex].disabled = true;
        console.log(`Wyłączono styl: ${this.styles[this.currentIndex].name}`);

        this.currentIndex = index;
        this.linkElements[this.currentIndex].disabled = false;
        console.log(`Włączono styl: ${this.styles[this.currentIndex].name}`);
    }
    private updateTogglerButtons(container: HTMLElement): void {
        const buttons = container.querySelectorAll('button');
        buttons.forEach((button, index) => {
            if (index === this.currentIndex) {
                button.style.background = '#007bff';
                button.style.color = '#fff';
                button.style.borderColor = '#007bff';
            } else {
                button.style.background = '#f8f9fa';
                button.style.color = '#333';
                button.style.borderColor = '#ddd';
            }
        });
        const info = container.querySelector('#current-style-info');
        if (info) {
            info.textContent = `Aktualny: ${this.styles[this.currentIndex].name}`;
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const toggler = new StyleToggler(STYLES);
    console.log('Aplikacja StyleToggler uruchomiona!');
    (window as any).styleToggler = toggler;
});
