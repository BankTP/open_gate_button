'use strict';

const { useCallback, useEffect, useRef, useState } = React

const containerHeight = 400
const buttonSize = 200
const maxTop = containerHeight - buttonSize
const topArea = 10
let initialMousePosition = 0;

function openTheGate() {
    return fetch(gate_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: gate_id }),
    }).then(() => {
        Toastify({
            text: 'สั่งเปิดประตูสำเร็จ',
            duration: 3000,
            position: 'center',
        }).showToast();
    })
        .catch(() => {
            Toastify({
                text: 'สั่งเปิดประตูไม่สำเร็จ',
                duration: 3000,
                position: 'center',
                style: {
                    background: "red",
                },
            }).showToast();
        });
}
function SingleButton() {

    const [atTop, setAtTop] = useState(false)

    useEffect(() => {
        let posY = 0;
        let moving = false;
        let isAtTop = false;
        function setIsTop(top) {
            isAtTop = top
            setAtTop(top)
        }
        function moveBack() {
            setIsTop(false)
            anime({
                targets: '#drag_button',
                translateY: 0,
                easing: 'easeOutCubic',
                duration: 300 * (posY / 200),
                complete: () => {
                    moving = false
                }
            })
            posY = 0
        }
        interact('#drag_button').draggable({
            listeners: {
                move(event) {
                    if (moving)
                        return
                    posY = Math.max(Math.min(posY + event.dy, 200), 0)
                    const y = posY > 190 ? 200 : posY
                    if (y >= maxTop) {
                        setIsTop(true)
                    } else if (isAtTop) {
                        setIsTop(false)
                    }
                    event.target.style.transform =
                        `translateY(${y}px)`
                },
            }
        }).on('dragend', async () => {
            moving = true;
            if (isAtTop) {
                await openTheGate()
            }
            moveBack()
        })
        // const draggable = new Draggable.default(document.querySelectorAll('#drag_lane'), {
        //     draggable: '.drag_button',
        //     delay: 0

        // });
        // draggable.on('drag:start', (evt) => {

        //     initialMousePosition = {
        //         x: evt.sensorEvent.clientX,
        //         y: evt.sensorEvent.clientY,
        //     };

        // });
        // draggable.on('drag:move', (evt) => {
        //     const dragRect = evt.source.getBoundingClientRect();

        //     //   return offset * 2 * 0.5;
        //     const offsetY = initialMousePosition.y - evt.sensorEvent.clientY;
        //     const top = dragRect.top - offsetY
        //     evt.mirror.style.transform = `translate3d(0px, ${top}px, 0)`;
        // });
        // draggable.on('drag:stop', () => console.log('drag:stop'));
    }, [])

    return <div id="main">
        <div id="hint">สไลด์เพื่อเปิดประตู</div>
        <div class="center">
            <div id="drag_lane">
                <div id="drag_button" key='drag_button'>
                    {atTop
                        ? <img src="img/ic_door_open.png" style={{ opacity: 0.8, width: '30%' }} />
                        : <img src='img/ic_arrow_down.png' id="arrow" />
                    }
                </div>
            </div>
        </div>
        <div id="version">รุ่น 1.0</div>
    </div >
}



const domContainer = document.querySelector('#app');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(SingleButton));