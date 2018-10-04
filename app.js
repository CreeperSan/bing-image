const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const nunjucks = require('nunjucks')

const router_index = require('./routes/index')
const router_api_v1 = require('./routes/api/v1')
const router_random = require('./routes/random')
const router_app = require('./routes/app')
const router_document = require('./routes/document')
const router_rank = require('./routes/rank')
const router_about = require('./routes/about')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'nunjucks'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(router_index.routes(), router_index.allowedMethods())
app.use(router_api_v1.routes(), router_api_v1.allowedMethods())
app.use(router_random.routes(), router_random.allowedMethods())
app.use(router_app.routes(), router_app.allowedMethods())
app.use(router_document.routes(), router_document.allowedMethods())
app.use(router_rank.routes(), router_rank.allowedMethods())
app.use(router_about.routes(), router_about.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
