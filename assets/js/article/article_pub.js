$(function () {
  let layer = layui.layer;
  let form = layui.form;
  GetArtCate();
  // 定义加载文章分类的方法
  function GetArtCate() {
    $.ajax({
      url: '/my/article/cates',
      method: 'GET',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败')
        }
        // 调用模版引擎渲染分类下拉菜单
        let htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        form.render();
      }
    })
  }
  // 初始化副文本编辑器
  initEditor();


  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 3. 更换裁剪的图片
  let imgUrl = '';
  $('#upImg').on('click', function (e) {
    e.preventDefault();
    $('#coverFile').click();
  })
  // 监听coverFile的change事件，获取用户选择的文件列表
  $('#coverFile').on('change', function (e) {
    e.preventDefault();
    let files = e.target.files[0];
    if (files.length === 0) {
      return layer.msg('未选择图片')
    }
    // 根据文件，创建对应的url地址
    let newImgURL = URL.createObjectURL(files);
    // 为裁剪区域重新设置图片
    imgUrl = $image.cropper('destroy').attr('src', newImgURL).cropper(options)
  })
  
  // 发送ajax请求
  // 准备要发送的数据
  var artState = '';
  // 为发布文章按钮，绑定点击事件处理函数
  $('#btnSave1').on('click', function (e) {
    artState = '已发布';
  })
  // 为存为草稿按钮，绑定点击事件处理函数
  $('#btnSave2').on('click', function (e) {
    artState = '草稿';
  })

  // 为表单绑定submit提交事件
  $('#form-pub').on('submit', function (e) {
    e.preventDefault();
    // 基于 form 表单，快速创建一个FormData 对象
    var fd = new FormData($(this)[0]);
    // 将文章发布状态存到fd中
    fd.append('state', artState);
    // 将封面裁剪过后的图片，输出为一个文件对象
    $image
    .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
      width: 400,
      height: 280
    })
    .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
      // 得到文件对象后，进行后续的操作
      // 将文件对象存储到fd中
      fd.append('cover_img', blob);
      
      // 发起ajax请求
      publishArtcicle(fd);
      

    })
  })


  //定义一个发布文章的方法publishArtcicle
function publishArtcicle(data) {
$.ajax({
        url: '/my/article/add',
        method: 'POST',
        data: data,
        contentType: false,
        processData: false,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('发布文章失败')
          }
          layer.msg('发布文章成功');
          location.href = '/article/article_list.html'
        }
      })
}
})