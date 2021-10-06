const toggleModal = (id) => {
    document.getElementById(id)
        .classList.toggle('modal-hidden');
};

document.querySelector('#create-new').addEventListener('click', () => toggleModal('modal-create'));
document.querySelector('#close-btn').addEventListener('click', () => toggleModal('modal-create'));
document.querySelector('#close-confirm-btn').addEventListener('click', () => toggleModal('modal-confirm'));


class State {
    static created = 0;
    static doing = 1;
    static done = 2;
}

class createtedTask {

    static tasks = [];

    static start() {
        this.btnNew();
        this.buttonConfirmDelete();
        //laikinai
        // createtedTask.createTask('pirma', 'išsivalyti dantis');
        this.load();

    }

    static createTask(title, description, state) {
        this.clearTasks()
        this.tasks.push(new createtedTask(title, description, state));
        this.renderTasks();
        this.count();
        this.save();

    }

    static renderTasks() {
        this.tasks.forEach(e => {
            e.render();
        });
    }

    static clearTasks() {

        this.tasks.forEach(e => {
            let parent = e.element.parentNode;
            if (parent) {
                parent.removeChild(e.element);
            }

        });
    }

    static btnNew() {

        const titleTask = document.querySelector("#titleTask");
        const descriptionTask = document.querySelector("#descriptionTask");
        const btnSave = document.querySelector("#saveBtn");
        const textArea = document.querySelector("#descriptionTask")
        //todo get focus on load modal box

        btnSave.addEventListener('click', () => {
            if (titleTask.value) {
                this.createTask(titleTask.value, descriptionTask.value);
                titleTask.value = '';
                descriptionTask.value = '';
                toggleModal('modal-create');
            } else {
                alert('Enter tasks title');
            }
        });

        textArea.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                btnSave.click();
            }
        })

    }

    static deleteTask(id) {

        this.tasks.forEach((e, i) => {
            if (id === `${e.id}`) {
                this.clearTasks();
                this.tasks.splice(i, 1);
                this.renderTasks();
            };
        });
        this.count();
        this.save();
    }

    static save() {
        const data = [];
        this.tasks.forEach(e => {
            data.push({
                title: e.title,
                description: e.description,
                state: e.state,
            })
        })
        console.log(data);

        localStorage.setItem('tasksApp', JSON.stringify(data));
    }

    static load() {
        if (null === localStorage.getItem('tasksApp')) {
            localStorage.setItem('tasksApp', JSON.stringify([]));
        }
        JSON.parse(localStorage.getItem('tasksApp')).forEach(e => {
            this.createTask(e.title, e.description, e.state);
        });
        this.count();
    }

    static showDeleteConfirmModal(id) {
        const modal = document.querySelector("#modal-confirm");
        modal.querySelector('#yesBtn').dataset.id = id;
        toggleModal('modal-confirm');
    }

    //pridejau 08-27

    static buttonConfirmDelete() {
        document.querySelector('#yesBtn').
            addEventListener('click', (e) => {
                console.log('pasp')
                this.deleteTask(e.target.dataset.id);
                this.hideModal("modal-confirm");
            });

    }

    static hideModal(id) {
        toggleModal(id);
        // delete modal.querySelector('#yesBtn').dataset.id; 
    }

    static moveTask(id) {
        this.tasks.forEach(task => {
            if (id == task.id) {
                const taskElement = document.getElementById(id);
                if (task.state === State.created) {
                    task.state = State.doing;
                    document.querySelector(".doing").appendChild(taskElement);
                    this.save();
                }
                else if (task.state === State.doing) {
                    task.state = State.done;
                    document.querySelector(".done").appendChild(taskElement);
                    this.save();
                }
            };
        })
        this.count();
    }

    static count() {
        const countAll = this.tasks.length;
        document.querySelector("#count_all").innerHTML = countAll;

        let countCreated = 0;
        let countDoing = 0;
        let countDone = 0;

        this.tasks.forEach(task => {
            if (task.state === State.created) {
                countCreated++;
            }
            if (task.state === State.doing) {
                countDoing++;
            }
            if (task.state === State.done) {
                countDone++;
            }
        })

        document.querySelector("#count_created").innerHTML = countCreated;
        document.querySelector("#count_done").innerHTML = countDone;
        document.querySelector("#count_doing").innerHTML = countDoing;
    }


    constructor(title, description, state = State.created) {
        this.title = title;
        this.description = description;
        this.state = state;
        this.createTaskId();
    }

    render() {
        this.createTaskElement();
        this.createTaskHtml();
        this.addDeleteButtonListener();
        this.addDoneButtonListener();
        this.addDblClikListener();

    }

    createTaskElement() {
        this.element = document.createElement("div");
        this.element.setAttribute('id', this.id);

        if (this.state === State.created) {
            document.querySelector(".created").appendChild(this.element);

        } else if (this.state === State.doing) {
            document.querySelector(".doing").appendChild(this.element);

        } else if (this.state === State.done) {
            document.querySelector(".done").appendChild(this.element);

        }


    }
    createTaskHtml() {
        const html = `
        <div id="task_element" class="createdTask">
        <div class="title-desc-conteiner">
        <p class="task-title">${this.title}</p>
        <p class="task-desc">${this.description}</p>
        </div>
        <div class="btn-container">
        <img src="done-icon.png" alt="done" class="done-btn" id="btnDone-${this.id}">
        <img src="trash-icon.png" class="trash" alt="delete" id="btnDelete-${this.id}">
        </div>
        </div>
        `;
        this.element.innerHTML = html;
    }
    createTaskId() {
        this.id = Math.floor(Math.random() * 9000000) + 100000;
    }
    addDeleteButtonListener() {
        this.element.querySelector(`#btnDelete-${this.id}`).addEventListener('click', () =>
            this.constructor.showDeleteConfirmModal(this.id))
        // this.constructor.deleteTask(this.id))
        //pridejau 08-27
    }
    addDoneButtonListener() {
        this.element.addEventListener('click', () =>
            this.constructor.moveTask(this.id))
    }

    addDblClikListener() {
        this.element.addEventListener('dblclick', () => {
            this.constructor.moveTask(this.id)
        })
    }


    static swiper = new Swiper(".mySwiper", {
        
        effect: "cards",
        grabCursor: true,
        breakpoints: {

            540: {
                enabled: false,
                effect: "none",
                slidesPerView: 3,
                spaceBetween: 20
            },
        },
    });


}



createtedTask.start();



