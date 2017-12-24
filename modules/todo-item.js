var h = require('hyperscript')
var pull = require('pull-stream')
var ref = require('ssb-ref')
var More = require('pull-more')
var HyperMoreStream = require('hyperloadmore/stream')

var moduleName = 'todos'

exports.needs = {
  sbot: {
    get: 'first',
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
    ])
  )
}


function renderCore(msg, api) {  
  const checkbox = (
    h('input.todoInput', {
      type: 'checkbox',
      onchange: function (ev) {
        const status = ev.target.checked
        api.confirm.show({
          type: 'todoaction',
          action: {
            link: msg.key,
            value: status,
          }
        }, null, function () {})
      },
    })
  )

  // load all actions for the todo
  pull(
    api.sbot.links({ dest: msg.key, rel: 'action' }),
    pull.asyncMap((e, cb) => {
      api.sbot.get(e.key, cb)
    }),
    pull.drain(function (e) {
      checkbox.checked = e.content.action.value
    })
  )

  return checkbox
}
