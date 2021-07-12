$(function () {
  // 点击“去注册账号”的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  });
  // 点击“去登录”的链接
  $('#link_login').on('click', function () {
    $('.reg-box').hide();
    $('.login-box').show();
  })

  // 从layui中获取form,layer对象
  var form = layui.form;
  let layer = layui.layer;
  // 通过form.verify来自定义校验规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6-12位，且不能出现空格'],
    repsd: function (value) {
      // value是确认密码框的内容，还要拿到密码框的内容，进行比较
      let pwd = $('.reg-box [name=password]').val();
      if (pwd != value) {
        return '两次密码不一致'
      }
    }
  })

  //监听注册表单的提交事件
  let rootUrl = 'http://api-breakingnews-web.itheima.net';
  let regUrl = '/api/reguser';
  let loginUrl = '/api/login';
  $('#form_reg').on('submit', function (e) {
    e.preventDefault();
    // 发起ajaxde POST请求
    $.ajax({
      url: rootUrl + regUrl,
      method: 'POST',
      data: {
        username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val()
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('注册失败!' + res.message)
        }
        layer.msg('注册成功,请登录');
        // 模拟人的点击行为
        setTimeout(function () {
          $('#link_login').click()
        }, 3000)
      }
    })
  });
  // 监听登录表单的提交事件
  $('#form_login').submit(function (e) {
    // 阻止默认提交行为
    e.preventDefault();
    // 发起ajax请求
    $.ajax({
      url: rootUrl + loginUrl,
      method: 'POST',
      // 快速获取表单数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败')
        }
        layer.msg('登录成功');
        // 将登录成功得到的token字符串保存到localStorage
        localStorage.setItem('token', res.token);
        // 跳转到后台主页
        location.href = '/index.html';
      }
    })
  })















})