var h = require('hyperscript')
var pull = require('pull-stream')
var ref = require('ssb-ref')
var More = require('pull-more')
var HyperMoreStream = require('hyperloadmore/stream')

var moduleName = 'todos'

exports.needs = {
  sbot: {
    createLogStream: 'first',
    links: 'first',
  },
  confirm: { show: 'first' }
}

exports.gives = {
  todo: { layout: true },
}

exports.create = function (api) {
  return {
    todo: {
      layout: function (msg) {
        return renderLayout(msg, api)
      },
    }
  }
}

function renderLayout(msg, api) {
  return (
    h('div.todo__wrapper', [
      renderCore(msg, api),
      h('label.todoLabel', `${msg.value.content.text}`),
      h('button', {
        onclick: function (ev) {
          console.log('clicked!')
        },
      }, 'toggle')
    ])
  )
}


function renderCore(msg, api) {
  const checkbox = (
    h('input.todoInput', {
      type: 'checkbox',
      onclick: function (ev) {
        console.log('clicked!')
        const status = ev.target.checked
        console.log('status:', status)
      },
      oninput: function (ev) {
        console.log('hey...')
        const status = ev.target.checked
        console.log('status:', status)
      },
      onchange: function (ev) {
        console.log('hey...')

        const status = ev.target.checked
        console.log('status:', status)
        // api.confirm.show({
        //   type: 'todo-action',
        //   vote: {
        //     link: msg.key, value: 1, expression: 'yup'
        //   }
        // }, null, function () {})
      },
    })
  )

  checkbox.addEventListener('click', () => console.log('clack!'))

  // pull(
  //   api.sbot.links({ dest: msg.key, rel: 'todo-action' }),
  //   pull.drain(function (e) {
  //     console.log('link:', e)
  //     checkbox.checked = e.content.value
  //   })
  // )

  return checkbox
}
