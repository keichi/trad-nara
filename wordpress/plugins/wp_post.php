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
add_image_size("node_thumb",300,200,true);

function wpost_get_lead($post){
	//要約を返す
	$content = $post->post_content;
	
	$hasTeaser = false;
	if ( preg_match('/<!--more(.*?)?-->/', $content, $matches) ) {
		$content = explode($matches[0], $content, 2);
		if ( !empty($matches[1]) && !empty($more_link_text) )
			$more_link_text = strip_tags(wp_kses_no_null(trim($matches[1])));
		
		//moreタグあり
		return $content[0];
	}
	
	//moreタグなし
	return $content;
}


function wpost_delete_post($post_id){
	$url = get_option("wpost_delete_url","http://127.0.0.1/internal/delete");
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
	$topimage = NULL;
	foreach ($image_posts as $image) {
		$meta = wp_get_attachment_image_src($image->ID, 'full');
		$images[] = array(
			'src' => $meta['url'],
			'width' => $meta['width'],
			'height' => $meta['height'],
			'title' => $image->post_title,
			'caption' => $image->post_excerpt,
			'description' => $image->content,
		);
		if(is_null($topimage)){
			$image_src = wp_get_attachment_image_src($image->ID,"node_thumb");
			$topimage = array(
							'src' => $image_src[0],
                        	'width' => intval($image_src[1]),
                        	'height' => intval($image_src[2]),
                	);
		}
	}

	
	$url = get_option("wpost_post_url","http://127.0.0.1/internal/post");
	$author = get_userdata($post->post_author);
	
	$categories = get_the_category($post_id);
	$category = "";
	if ($categories) {
		$category = $categories[0]->name;
	}

	//POSTするデータ
	$data = array(
		'id' => $post->ID,
		'created' => $post->post_date,
		'modified' => $post->post_modified,
		'author_id' => $post->post_author,
		'author' => $author->display_name,
		'title' => $post->post_title,
		'lead' => wpost_get_lead($post),
		'body' => apply_filters('the_content',$post->post_content),
		'address' => get_post_meta($post->ID,"address",true),
		'label' => get_post_meta($post->ID,"label",true),
		'images' => $images,
		'topimage' => $topimage,
		'category' => $category,
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
	add_options_page($name, $name, 'manage_options', basename(__FILE__), 'wp_post_admin' );
}

function wp_post_admin(){
	if ( !current_user_can( 'manage_options' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}
	
	$hidden_field_name = 'wpost_submit_hidden';
	
	if( isset($_POST[ $hidden_field_name ]) && $_POST[ $hidden_field_name ] == 'Y' ) {
		$wpost_post_url = $_POST["wpost_post_url"];
		$wpost_delete_url = $_POST["wpost_delete_url"];
		update_option( "wpost_post_url", $wpost_post_url );
		update_option( "wpost_delete_url", $wpost_delete_url );
		?>
		<div class="updated"><p><strong><?php _e('settings saved.' ); ?></strong></p></div>
		<?php
		
	}
	
?>
	<h2>WordPress POST 設定</h2>
	<form method=post action="">
	<input type="hidden" name="<?php echo $hidden_field_name; ?>" value="Y">
	<h3>URL</h3>
	<table class="form-table">
	<tbody><tr>
		<th><label for="wpost_post_url">投稿URL</label></th>
		<td> <input name="wpost_post_url" id="wpost_post_url" type="text" value="<?php echo get_option("wpost_post_url"); ?>" class="regular-text code"></td>
	</tr>
	<tr>
		<th><label for="wpost_delete_url">削除URL</label></th>
		<td> <input name="wpost_delete_url" id="wpost_delete_url" type="text" value="<?php echo get_option("wpost_delete_url"); ?>" class="regular-text code"></td>
	</tr>
	</tbody></table>
	
	<p class="submit"><input type="submit" name="submit" id="submit" class="button-primary" value="変更を保存"  /></p>
	</form>
<?php
}




?>