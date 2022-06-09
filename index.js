'use strict';

function init() {
    const containerHeight = 400
    const buttonSize = 200
    const maxTop = containerHeight - buttonSize

    const door = document.getElementById('door')
    const arrow = document.getElementById('arrow')
    let posY = 0;
    let moving = false;
    let isAtTop = false;

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

    function setIsTop(top) {
        isAtTop = top
        if (isAtTop) {
            door.style.display = "block"
            arrow.style.display = "none"
        } else {
            door.style.display = "none"
            arrow.style.display = "block"
        }
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
            async end() {
                moving = true;
                if (isAtTop) {
                    await openTheGate()
                }
                moveBack()
            }
        }
    })
}

init()