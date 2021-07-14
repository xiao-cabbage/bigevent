$(function () {
  let layer = layui.layer;
  let form = layui.form;
  var laypage = layui.laypage;
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (data) {
    alert('ok')
    const dt = new Data(data);
    let y = dt.getFullYear();
    let m = padZero(dt.getMonth() + 1);
    let d = padZero(dt.getDate());

    let hh = padZero(dt.getHours());
    let mm = padZero(dt.getMinutes());
    let ss = padZero(dt.getSeconds());
    return y + '-' + m + '-' + d + ' ' + hh + ':' + m + ':' + ss
  }
  function padZero(n) {
    n > 9 ? n : '0' + n
  }

  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  let q = {
    pagenum: 1,	  //页码值
    pagesize: 2,	//每页显示多少条数据
    cate_id: '',	//文章分类的 Id
    state: ''     //文章的状态
  }
  initGetArtList();
  initCate();
  // 1、初始化文章列表数据
  function initGetArtList() {
    $.ajax({
      url: '/my/article/list',
      method: 'GET',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败')
        }
        // 使用模版引擎渲染页面数据
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr);
        // 渲染分页
        renderPage(res.total);
        // 判断是否有数据
        if (res.data.length <= 0) {
          return $('tbody').html('暂无文章记录！').css({
            'margin': '20px auto',
            'display': 'inline-block'
          })
        }
      }
    })
  }
  // 2、初始化文章分类的方法
  function initCate() {
    $.ajax({
      url: '/my/article/cates',
      method: 'GET',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取数据失败')
        }
        let htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        // 通知layui重新渲染表单区域
        form.render();
      }

    })
  }
  // 3、为筛选表单绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val();
    var state = $('[name=state]').val();
    // 为查询参数对象q赋值
    q.cate_id = cate_id;
    q.state = state;
    initGetArtList();
  })
  // 4、定义渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: 'pageBox',  // 注意，这里的 test1 是 ID，不用加 # 号
      count: total,     // 数据总数，从服务端得到
      limit: q.pagesize,// 每页显示的条数
      curr: q.pagenum,   // 默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 切换分页的回, 调
      jump: function (obj, first) {
        q.pagenum = obj.curr;//最新当前页，以便向服务端请求对应页的数据。
        q.pagesize = obj.curr;//最新的每页显示的条数
        // 根据最新的q获取对应的数据列表，并渲染数据列表
        //首次不执行
        if (!first) {
          initGetArtList();
        }
      }
    });

    //do something



    // 5、删除文章数据
    $('tbody').on('click', '#delArt', function (e) {
      e.preventDefault();
      layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
        let id = $('#delArt').attr('data-id');
        $.ajax({
          url: '/my/article/delete/' + id,
          method: 'GET',
          success: function (res) {
            if (res.status !== 0) {
              return layer.msg('删除文章失败');
            }
            layer.msg('删除文章成功');
            initGetArtList();
          }
        })
        layer.close(index);
      });
    })

  }



})