<?php
/*
Plugin Name: Wordpress Post
Plugin URI: http://blog.chibiegg.net/
Description: wpost
Version: 0.1 alpha
Author: chibiegg
Author URI: http://blog.chibiegg.net/
License: Undefined
*/

add_action("edit_post","wpost_post_post");
add_action("delete_post","wpost_delete_post");

function wpost_delete_post($post_id){
	$url = get_option("wpost_delete_url","http://localhost/internal/post/delete");
	$data = array(
		'id' => $post_id,
	);
	$options = array('http' => array(
		'method' => 'POST',
		'content' => http_build_query($data),
	));
	//POSTする
	$contents = file_get_contents($url, false, stream_context_create($options));
	return $post_id;
}

function wpost_post_post($post_id){
	//投稿編集時のフック
	$post = get_post($post_id);

	//「ゴミ箱」は削除としてあつかう
	if($post->post_status == "trash"){
		wpost_delete_post($post_id);
	}

	//「投稿」でないものは無視，「公開」でないものは無視
	if($post->post_type != "post" || $post->post_status != "publish"){
		return $post_id;
	}
	
	//関連する画像を取得
	$image_posts = get_posts(array(
			'post_parent' => $post->ID,
			'post_type' => 'attachment',
			'post_mime_type' => 'image',
			'orderby' => 'menu_order',
			'order' => 'ASC',
			'numberposts' => 999,
		));
	$images = array();
	foreach ($image_posts as $image) {
		$meta = wp_get_attachment_metadata($image->ID);
		$images[] = array(
			'alt' => $image->post_excerpt,
			'src' => $image->guid,
			'width' => intval($meta['width']),
			'height' => intval($meta['height']),
		);
	}

	
	$url = get_option("wpost_post_url","http://localhost/internal/post/create");
	//JSONに含めるデータ
	
	$author = get_userdata($post->post_author);
	
	$data_for_json = array(
		'id' => $post->ID,
		'created' => $post->post_date,
		'modified' => $post->post_modified,
		'author_id' => $post->post_author,
		'author' => $author->display_name,
		'title' => $post->post_title,
		'lead' => $post->post_excerpt,
		'body' => $post->post_content,
		'address' => get_post_meta($post->ID,"address",true),
		'label' => get_post_meta($post->ID,"label",true),
		'images' => $images,
	);
	$data = array(
		'data' => json_encode($data_for_json),
	);
	
	$options = array('http' => array(
		'method' => 'POST',
		'content' => http_build_query($data),
	));
	//POSTする
	$contents = file_get_contents($url, false, stream_context_create($options));

	return $post_id;
}


/*
管理ページ
*/

add_action('admin_menu', 'wpost_addmenu');
function wpost_addmenu() {
	$name = '投稿POST設定';
	add_options_page($name, $name, 10, basename(__FILE__),'wp_post_admin');
}

function wp_post_admin(){
?>
<p>Hello World</p>
<?php

}




?>
