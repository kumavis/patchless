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
  todo: { layout: 'first' },
  confirm: { show: 'first' },
}

exports.gives = {
  app: { menu: true, view: true }
}


exports.create = function (api) {
  return {
    app: {
      view: function (src) {
        if(src !== moduleName) return

        var content = h('div.content', [
          h('input#todo-form-label'),
          h('button', {
            onclick: () => {
              const text = document.querySelector('#todo-form-label').value
              createTodo(api, text)
            }
          }, 'create')
        ])

        function createStream (opts) {
          return pull(
            More(api.sbot.createLogStream, opts),
            pull.filter(function (data) {
              return 'todo' === data.value.content.type
            }),
            pull.map(api.todo.layout)
          )
        }

        pull(
          createStream({old: false, limit: 10}),
          HyperMoreStream.top(content)
        )

        pull(
          createStream({reverse: true, live: false, limit: 10}),
          HyperMoreStream.bottom(content)
        )

        return content

      },
      menu: function () {
        return moduleName
      }
    }
  }
}

function createTodo(api, text){
  api.confirm.show({
    type: 'todo',
    text: text,
  }, null, function () {})
}