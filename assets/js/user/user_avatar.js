$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }
  // 1.3 创建裁剪区域
  $image.cropper(options)


  // 2. 更换裁剪的图片
  $('#upFile').on('click', function () {
    $('#file').click();
  })
  $('#file').on('change', function (e) {
    var file = e.target.files[0]

    var newImgURL = URL.createObjectURL(file)
    // 销毁旧的裁剪区域、 // 重新设置图片路径、// 重新初始化裁剪区域
    $image.cropper('destroy').attr('src', newImgURL).cropper(options)


  })
  $('#upLoadImg').on('click', function () {
    // 3. 将裁剪后的图片，输出为 base64 格式的字符串
    var dataURL = $image.cropper('getCroppedCanvas', {
      // 创建一个 Canvas 画布
      width: 100,
      height: 100
    }).toDataURL('image/png')
    // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    $.ajax({
      url: '/my/update/avatar',
      method: 'POST',
      data: {
        avatar: dataURL
      },
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('头像更新失败！')
        }
        layui.layer.msg('头像更新成功！')
        window.parent.getUserInfo()
      }
    })
  })



})