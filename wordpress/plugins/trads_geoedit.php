<?php
/*
Plugin Name: Trads GEO Edit
Plugin URI: http://blog.chibiegg.net/
Description: Trads GEO Edit
Version: 0.1 alpha
Author: chibiegg
Author URI: http://blog.chibiegg.net/
License: Undefined
*/


add_action('admin_menu', 'add_geoedit_box');
add_action('save_post', 'geoedit_save_postdata');


//編集ボックスの追加
function add_geoedit_box(){
	add_meta_box( 'geoedit_sectionid', "Geotag",'geoedit_inner_custom_box', 'post', 'advanced' );
}

//編集BOXのHTML
function geoedit_inner_custom_box(){

	$post_id = intval($_GET["post"]);
	$address = get_post_meta($post_id,"address",true);
	$label = get_post_meta($post_id,"label",true);

	?>
		<input type="hidden" name="geoedit_noncename" id="geoedit_noncename" value="<?php echo wp_create_nonce( plugin_basename(__FILE__) ); ?>" />
	
		<label for="geoedit_address">Address</label>
		<input type="text" name="geoedit_address" value="<?php echo $address; ?>" size="40" />
		<label for="geoedit_label">Label</label>
		<input type="text" name="geoedit_label" value="<?php echo $label ?>" size="40" />
	<?php
}


//保存時の処理
function geoedit_save_postdata($post_id){

	//認証を通っていない場合は実行しないで終る
	if ( !wp_verify_nonce( $_POST['geoedit_noncename'], plugin_basename(__FILE__) )) {
		die("1");
		return $post_id;
	}

	//自動保存ルーチンなら何もしない
	if ( defined('DOING_AUTOSAVE') && DOING_AUTOSAVE ){
		die("2");
		return $post_id;
	}
	
	// パーミッションチェック
	if ( 'page' == $_POST['post_type'] ) {
		if ( !current_user_can( 'edit_page', $post_id ) ){
		die("3");
			return $post_id;
		}
	} else {
		if ( !current_user_can( 'edit_post', $post_id ) ){
		die("4");
			return $post_id;
		}
	}

	$address = $_POST['geoedit_address'];
	$label = $_POST['geoedit_label'];
	
	update_post_meta($post_id,"address",$address);
	update_post_meta($post_id,"label",$label);
	
	
	return $post_id;
}





?>