import { updateValues } from '../../Result/Result.js';


const button = document.getElementById('getResult');
button.addEventListener('click', () => {
    PrintArea = document.getElementById("PrintArea")
    PrintArea.style.display = "flex"
    updateValues();
});