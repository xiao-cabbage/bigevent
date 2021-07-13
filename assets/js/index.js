$(function () {
  // 调用getUserInfo获取用户基本信息
  getUserInfo();

  let layer = layui.layer;
  // 为退出按钮绑定点击事件
  $('#btnLogout').on('click', function () {
    layer.confirm('是否确认退出登录？', { icon: 3, title: '提示' }, function (index) {
      //do something
      localStorage.removeItem('token');
      location.href = '/login.html';
      layer.close(index);
    });
  })
})

// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    url: '/my/userinfo',
    method: 'GET',
    headers: {
      Authorization: localStorage.getItem('token') || ''
    },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败')
      }
      //调用 renderAvatar 渲染用户头像
      renderAvatar(res.data);
    }
    
  })
}

// 渲染用户头像
function renderAvatar(user) {
  // 获取用户的昵称
  let name = user.nickname || user.username;
  // 设置欢迎的文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
  // 渲染用户头像
  if (user.user_pic !== null) {
    // 图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show();
    $('.text-avatar').hide();
  } else {
    // 文本头像
    $('.layui-nav-img').hide();
    let first = name[0].toUpperCase();
    $('.text-avatar').html(first).show();
  }
}