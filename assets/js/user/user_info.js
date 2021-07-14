$(function () {
  var form = layui.form;
  let layer = layui.layer;
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '用户昵称长度必须在1-6个字符之间'
      }
    }
  });
  initUserInfo();

  // 初始化用户信息
  function initUserInfo() {
    $.ajax({
      url: '/my/userinfo',
      method: 'GET',
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('获取用户信息失败');
        }
        form.val('formUserInfo', res.data);
      }
    })
  }


  $('.layui-form').on('submit', function (e) {
    // 阻止表单默认提交行为
    e.preventDefault();
    // 发起ajax数据请求
    $.ajax({
      url: '/my/userinfo',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('更新用户信息失败')
        }
        layer.msg('更新用户信息成功')
        // 调用父页面的方法，重新渲染用户的头像和用户信息
        window.parent.getUserInfo();
      }
    })
  })

  // 重置表单数据
  $('#btnReset').on('click', function (e) {
    // 阻止表单默认重置行为
    e.preventDefault();
    initUserInfo();
  })






})