$(function () {
  let form = layui.form;
  let layer = layui.layer;
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6-12位，且不能出现空格'],
    repwd: function (value) {
      // value是确认密码框的内容，还要拿到密码框的内容，进行比较
      let pwd = $('.layui-form [name=newPwd]').val();
      if (pwd !== value) {
        return '两次密码不一致'
      }
    },
    samePwd: function (value) {
      let oldPwd = $('.layui-form [name=oldPwd]').val();
      if (oldPwd === value) {
        return '新密码不能和旧密码相等'
      }
    }
  });

$('.layui-form').on('submit', function(e){
  e.preventDefault();
  $.ajax({
    url: '/my/updatepwd',
    method: 'POST',
    data: $(this).serialize(),
    success: function (res) {
      if (res.status !== 0 ) {
        return layer.msg('更新密码失败')
      }
      layer.msg(res.message);
      $('.layui-form')[0].reset();
    }
  })
})

})