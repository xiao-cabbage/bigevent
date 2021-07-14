$(function () {
  let layer = layui.layer;
  let form = layui.form;
  // 1、获取文章分类列表
  initArtCateList();
  function initArtCateList() {
    $.ajax({
      url: '/my/article/cates',
      method: 'GET',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类失败')
        }
        let tmpHtml = template('tpl-table', res);
        $('#cateList').html(tmpHtml);
      }
    })
  }

  let indexAll = null;
  $('#btnAddCate').on('click', function () {
    indexAll = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '添加文章分类',
      content: $('#addCate').html()
    });
  })
  // 2、添加分类
  // 通过代理的形式为form-add 表单绑定submit事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/my/article/addcates',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('添加分类失败')
        }
        initArtCateList();
        layer.msg('添加分类成功');
        $('#form-add [type=reset]').click();
        // 关闭弹出层
        layer.close(indexAll)
      }
    })
  })
  // 3、编辑分类
  let editCateS = null;
  $('tbody').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    // 弹出一个修改文章分类信息的层
    editCateS = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '修改文章分类',
      content: $('#editCate').html()
    });
    let id = $(this).attr('data-id');
    // 发起请求获取对应分类的数据    
    $.ajax({
      url: '/my/article/cates/' + id,
      method: 'GET',
      success: function (res) {

        if (res.status !== 0) {
          return layer.msg('获取文章分类信息失败')
        }
        form.val('form-edit', res.data)
      }
    })
  })
  //  为form-edit绑定提交事件，发起ajax数据请求
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/my/article/updatecate',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新分类信息失败')
        }
        layer.msg('更新分类信息成功');
        layer.close(editCateS);
        initArtCateList();
      }
    })
  })

  //  4、删除分类
  $('body').on('click', '.btn-del', function (e) {
    e.preventDefault();
    let id = $(this).attr('data-id');
    layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        url: '/my/article/deletecate/' + id,
        method: 'GET',
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章分类失败')
          }
          layer.msg('删除文章分类成功')
          initArtCateList();
        }
      })

      layer.close(index);
    });

  })






})