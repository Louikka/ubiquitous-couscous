let USER_NAME = localStorage.getItem('username');
if (USER_NAME === null)
{
    document.getElementById('dialog')!.hidden = false;
}
else
{
    document.getElementById('username')!.textContent = USER_NAME;
}


window.addEventListener('beforeunload', () =>
{
    if (USER_NAME !== null)
    {
        localStorage.setItem('username', USER_NAME);
    }
});

(document.getElementById('get-user-name-form') as HTMLFormElement).addEventListener('submit', (ev) =>
{
    ev.preventDefault();

    const e_InputField = document.getElementById('get-user-name-text') as HTMLInputElement;

    const text = e_InputField.value.trim();

    if (text.length === 0)
    {
        return;
    }

    USER_NAME = text;
    document.getElementById('username')!.textContent = USER_NAME;
    document.getElementById('dialog')!.hidden = true;
});

(document.getElementById('chat-input-form') as HTMLFormElement).addEventListener('submit', (ev) =>
{
    ev.preventDefault();

    const e_InputField = document.getElementById('chat-input-form-text') as HTMLInputElement;

    const text = e_InputField.value.trim();

    if (text.length === 0)
    {
        return;
    }

    fetch('http://localhost:8081/api/messages', {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify({
            content : {
                id : 0,
                user : USER_NAME ?? 'UndefinedUser',
                text,
                timestamp : Date.now(),
            },
        } as POSTReqBody),
    });

    e_InputField.value = '';
});



if (!window['WebSocket'])
{
    newLog('Your browser does not support WebSockets.', 'error');
}


const ws = new WebSocket('ws://localhost:8080');

ws.addEventListener('close', () =>
{
    newLog('Connection closed.');
});

ws.addEventListener('message', (ev) =>
{
    let data: WSSendData;

    try
    {
        data = JSON.parse(ev.data);
    }
    catch (err)
    {
        console.error(err);
        return;
    }

    if (data.type === 'message')
    {
        let message = data.content;

        newMessage(message.user, message.text);
    }
    else
    {
        console.log('Recieved data from WebSocket are not of type "message".')
    }
});



/* Helpers *******************************************************************/

function chatAppend(e: Element)
{
    const root = document.getElementById('chat')!;

    root.append(e);

    if (root.scrollTop > (root.scrollHeight - root.clientHeight - 1))
    {
        root.scrollTop = root.scrollHeight - root.clientHeight;
    }
}

function newMessage(name: string, text: string)
{
    const e = document.createElement('div');
    e.classList.add('chat-message');
    e.innerHTML = `<b class="chat-message-name">${name}</b>: <span class="chat-message-text">${text}</span>`;

    chatAppend(e);
}

function newLog(s: string, type: 'log' | 'error' = 'log')
{
    const e = document.createElement('div');
    e.classList.add('chat-log');
    e.innerHTML = `<b>${s}</b>`;

    switch (type)
    {
        case 'log':
        {
            break;
        }

        case 'error':
        {
            e.classList.add('chat-log-error');
            break;
        }
    }

    chatAppend(e);
}
