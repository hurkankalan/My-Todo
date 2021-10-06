// Création du texte defilant dans notre h1
let messageToDisplay = "To do list project in JavaScript."; 
let displayedMessage = ""
let i = 0;

setInterval(()=>{
    if(i < messageToDisplay.length){
        displayedMessage += messageToDisplay[i];
        document.querySelector("h1").innerText = displayedMessage
        i++
    }
}, 100);

// Création des références
const ul = document.querySelector('ul');
const form = document.querySelector('form');
const input = document.querySelector('form > input');

// Creation d'une variable de type array qui contiendra plusieurs objects qui représente notre liste
const todos = [
    /*
    {
        text: 'Faire les courses', // contenu du texte affiché dans nos todos
        done: false, // statut pour savoir si le todo est validé ou pas (le span devient blanc ou gris matte selon le boolean)
        editMode : false
    },
    {
        text: 'Concert de jazz le 25 avril',
        done: false,
        editMode : false
    },
    */
];

// Fonction qui permet de créer nos nodes li
const createTodoElement = (todo, index) => {
    const li = document.createElement('li');  
    li.innerHTML = `
    <span class="todo ${todo.done ? 'done' : ''}"></span>
    <p class="${todo.done ? 'done' : ''}">${todo.text}</p>
    <button class="button-edit">Edit</button>
    <button class="button-delete">Delete</button>
    `;
    /* L'élément span va permettre d'afficher un cercle rempli ou non suivant que la todo est terminée ou non.
    Nous utilisons un ternaire dans un littéral de modèle pour ajouter la classe .done en fonction de la valeur du booléen todo.done
    L'élément <p> va nous permettre d'afficher le texte de la todo. */
    li.querySelector('.button-delete').addEventListener('click', (event) => {
        deletTodo(index); // Fonction qui supprime une tache selon l'index
        event.stopPropagation();
    });
    li.addEventListener('click', event => {
        toggleTodo(index); // Fonction qui modifie le statut d'une todo
    });
    li.querySelector('.button-edit').addEventListener('click', (event) => {
        event.stopPropagation();
        toggleEditMode(index); // fait reference a l'index en cours
    });
    return li;
};

const createTodoEditElement = (todo, index) => {
    const li = document.createElement("li");
    const input = document.createElement("input");
    const buttonSave = document.createElement("button");
    buttonSave.innerHTML = "Save";
    buttonSave.style.backgroundColor = "#218c74";
    const buttonCancel = document.createElement("button");
    buttonCancel.innerHTML = "Cancel";
    buttonCancel.style.backgroundColor = "#c23616";
    buttonCancel.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleEditMode(index);
    })
    buttonSave.addEventListener('click', (event) => {
        event.stopPropagation();
        editTodo(index, input);
    })
    input.type = "text";
    input.value = todo.text;
    li.append(input, buttonCancel, buttonSave);
    return li;
};

// Fonction qui permet de positionner et d'afficher nos todos dans le DOM
const displaytodo = () => {
    const todosNode = todos.map((todo, index) => {
        if(todo.editMode){
            return createTodoEditElement(todo, index);
        } else {
            return createTodoElement(todo,index);
        };
    })
    ul.innerHTML = '';
    ul.append(...todosNode);
    /*
    On convertit notre tableau de nodes en liste de nodes (en utilisant l'opérateur spread).
    Cette conversion est obligatoire car la méthode append() prend en parametre une liste de nodes séparés par des virgules,
    pas un tableau
    */
};

displaytodo(); // on fait un appel de la fonction displaytodo pour qu'elle soit executé et que nos <li> soit affiché dans le DOM

form.addEventListener('submit', (event) => { // on recupere l'evenement qui est passé en perimetre par la web API
    event.preventDefault(); // on bloque le refresh de la page (car un bouton sans type se comporte comme un bouton de type submit)
    const value = input.value; // La propriété value d'un HTMLInputElement permet de récupérer la valeur contenue dans l'input
    input.value = ''; // quand on ajoute une todo on vide le contenu de l'input
    // on ajoute notre nouvel element dans notre liste de todo
    addTodo(value);
    displaytodo();
});

// Fonction qui va ajouter la nouvelle todo à notre liste
const addTodo = (text) => {
    todos.push({
        text, // Equivaut à écrire text: text, depuis ES6
        done: false
    })
};

/*
Fonction pour supprimer une tache selon l'index : méthode splice() d'un array modifie directement le tableau sur lequel elle est appelée
et ne renvoie pas un nouveau tableau donc c'est ce qui nous faut
*/
const deletTodo = index => {
    todos.splice(index, 1); // on supprime un element à partir de l'index
    displaytodo(); // on réinvoque la fonction displaytodo() afin de rafraichir l'affichage des todos
};

// Modifier le statut d'une todo
const toggleTodo = index => {
    todos[index].done = !todos[index].done;
    displaytodo();
};

// Passer en edit mode
const toggleEditMode = index => {
    todos[index].editMode = !todos[index].editMode;
    displaytodo();
};

// Affecter la valeur de l'input au texte en mode edit
const editTodo = (index, input) => {
    const value = input.value;
    todos[index].text = value;
    todos[index].editMode = false;
    displaytodo();
}